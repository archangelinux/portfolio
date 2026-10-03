---
title: Karpathy's NanoGPT tutorial
description: Notes from building a GPT from scratch, from tokenizing Shakespeare to self-attention, multi-head attention and transformer blocks.
date: 2026-08-25
tags: [ml, transformers, pytorch]
kind: note
---

Notes from [Karpathy's NanoGPT tutorial](https://www.youtube.com/watch?v=kCc8FmEb1nY).

**Input:** a bunch of Shakespeare text

## Data prep

1. Get a sorted list of unique chars, along with the size of this alphabet/vocab.
2. Develop a strategy to tokenize the input text.
   - E.g. a simple one for this example: translate individual characters into integers via a simple ordered mapping (encode to a list of integers, decode to get back the same string).
   - Google uses **SentencePiece** (sub-word tokenizer).
   - GPT uses **tiktoken** (byte-pair encoding).
3. Using PyTorch: wrap the entire encoded text into a `torch.tensor` to get a data tensor.
   - This sequence of integers is an identical translation of the first x characters of the text.
4. Split the data into train and validation sets (90/10).
5. To train a transformer, only train on sampled chunks at a time, of a maximum length (**block size**).
   - Within a chunk of `block_size + 1`, there are `block_size` training examples, since each pair means "in the context of the first, the second comes next."
   - So for each block size, get 2 chunks offset by 1 to get `block_size` contexts and their corresponding targets.
   - Now the transformer can use [aggregate] context of size 1 up to block size to predict the next character.
6. **Batch size:** the number of independent sequences processed in parallel. The input will be a 2D tensor of `batch × block_size`.

## Bigram baseline

7. Given a batch of input, we feed it into a neural network. The simplest is a **bigram language model**: a statistical tool that predicts the next word or char in a sequence based entirely on the immediately preceding item. It relies on the Markov assumption, meaning past history beyond that is ignored.
   - `BigramLanguageModel`, in this example constructed as a `torch.nn.Module` class, initializes a token embedding table of `vocab_size × vocab_size`. It holds logits (raw scores, or predictions) that give an association score for each token (row).
     - **(B, T, C) tensor:** Batch size (B), Time steps (T), and Channels/Features (C). Here block size is the time steps, and the logits are the channels (the full vocab).
   - Evaluate the loss function of the prediction (`cross_entropy` in PyTorch → LogSoftmax).
   - Iteratively predict, sample, and append new tokens one by one based on the probabilities of the very last time step.
   - Eventually, when it's not a bigram model, the history/preceding tokens will also be used.
8. Create a PyTorch optimizer: `torch.optim.AdamW(m.parameters(), lr=1e-3)`
9. Write a simple training loop. The loss can be seen improving.
10. `no_grad` means no backpropagation.

## The math trick in self-attention

11. For a randomized `B, T, C = 4, 8, 2` (just for demo purposes):
    - What is the easiest way for tokens to communicate with past tokens?
      - Average the preceding elements + itself. This is weak and lossy, with no spatial info, but we'll start with this.
      - **Trick:** use matrix multiplication with a lower triangular matrix to get a running sum. Normalize the lower triangular matrix to get a running average. This is the basis of how we can represent a weighted sum.
12. The lower triangular matrix is the **weights** `(T, T)`, which PyTorch turns into `(B, T, T)` for batch matrix multiplication.
13. `(B, T, T) @ (B, T, C) → (B, T, C)`

## Embeddings

14. Replace the second dimension of the embedding table with `n_embd = 32`, then add a linear layer to transform into logits.

```python
self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
self.lm_head = nn.Linear(n_embd, vocab_size)

def forward(self, idx, targets=None):
    # idx and targets are both (B,T) tensor of integers
    tok_emb = self.token_embedding_table(idx)  # (B,T,C)
    logits = self.lm_head(tok_emb)             # (B,T,vocab_size)
```

15. Create a **position embedding table** `(T, C)` to hold not only token identities but also the positions at which the tokens occur.

### The dimensions: B, T, C

| Dim | Meaning | Example |
| --- | --- | --- |
| **B** (batch) | How many independent sequences at once. Sequences never interact across B; it's parallelism only. | 4 |
| **T** (time) | Token positions per sequence. Position 5 comes after 4. | 8 |
| **C** (channels) | Length of the vector representing each token: "Everything the model knows about this token." | 32 |

`x` has shape `(B, T, C)` = 4 sequences × 8 tokens × 32 numbers each.

### The three different "C"s

Karpathy reuses the letter.

- **C = 2:** throwaway toy value, only used to eyeball the averaging trick.
- **65 = `vocab_size`:** how many distinct tokens exist (the alphabet). A count, not a vector length.
- **32 = `n_embd`:** how richly each token is represented. This is the real C.

The bigram model fused them: `Embedding(65, 65)`, so embeddings doubled as logits. The transformer unties them. The table is `(65, 32)`, the interior works in 32, and the output maps back to 65.

> [!KEY]
> `vocab_size` matters only at the entrance (table height) and the exit (logit count). The model's interior never sees it.

### Why does C change?

| Dimension | In the Bigram Model | In the GPT-2 Transformer |
| --- | --- | --- |
| **B** (Batch) | Driven by input (e.g. 4) | Driven by input (e.g. 4) |
| **T** (Time) | Driven by input (up to `block_size`) | Driven by input (up to `block_size`) |
| **C** (Channels) | `vocab_size` (e.g. 50257) | `n_embd` (e.g. 768) |

- **Bigram:** there are no hidden layers or attention blocks. The input tokens look up their next-token predictions *instantly* from a `(vocab_size, vocab_size)` matrix, so the features (C) at every step are the raw prediction scores (logits) for the entire vocabulary.
- **Transformer:** the input tokens look up a dense concept vector from a `(vocab_size, n_embd)` matrix. The features (C) are hidden representations (`n_embd`). The raw prediction scores (`vocab_size`) don't appear until the final `lm_head` layer at the very end of the network.

### Where 32 comes from

Nowhere. It's a hyperparameter, chosen by feel/budget before training and validated by whether the loss drops.

- Bigger = more representational capacity, but more compute.
- Karpathy: 32 (laptop). GPT-2: 768.
- The only hard constraints: it must be divisible by the head count, and hardware likes powers of 2.

## Self-attention

16. Self-attention with `B, T, C = 4, 8, 32`

Every node/token at each position emits 2 vectors, a **query** and a **key**:

- **Query:** what am I looking for? `(B, T, head_size)`
- **Key:** what do I contain? `(B, T, head_size)`

The affinities between tokens in a sequence come from a dot product between query and keyᵀ, which gives us the weights: `(B, T, 16) @ (B, 16, T) → (B, T, T)`

> [!INFO] head
> One individual processing unit in self-attention. It computes its own set of query, key, and value projections for a sequence, with its own weights focusing on a particular relationship type.

> [!INFO] multi-head attention
> Different heads focusing on different aspects of affinity work in parallel to produce a unified representation.

`head_size = # of channels / # of heads`

### How k, q, v are obtained

- Three independent Linear layers each read the **full** 32-dim vector, and each outputs its own 16.
- Each `Linear(32, 16)` is a (32×16) weight matrix. Every output number = a weighted sum of all 32 inputs. That's 512 weights per matrix and 1,536 total, all fully independent.
- **k** = advertisement ("what I contain"), **q** = question ("what I'm looking for"), **v** = payload ("what I hand over").
- Analogy: three different 16-word summaries (topic/tone/intent) of the same 32-word sentence.
- **Linear ≠ reshape.** Reshape conserves element count. Linear maps to ANY width (32→16, 32→65, 32→50k).

### The attention computation (shape story)

1. **`wei = q @ kᵀ`:** `(B,T,16) @ (B,16,T) → (B,T,T)`. Every query is dotted with every key. The 16 vanishes because a dot product outputs one number. `(T,T)` is the token-to-token affinity table, the signature shape of attention.
2. **Mask:** `tril` + `masked_fill(-inf)` means token i can only see positions ≤ i. No peeking at the future. Softmax turns -inf into 0 weight, and each row becomes a probability distribution over the past.
3. **`out = wei @ v`:** `(B,T,T) @ (B,T,16) → (B,T,16)`. Each token's output is a weighted average of the values of the tokens it attended to.

> [!KEY] one-liner
> Each token asks a question (q), scores everyone's ads (k) to decide who to listen to (wei), then averages what they hand over (v).

### How the output "maps back" to the alphabet

- `lm_head = Linear(32, 65)`: the same operation as key/query/value, just a wider matrix. Going UP in size needs no new mechanism.
- The 65 outputs mean "score per character" only because position j is interpreted as character j and the loss trained it that way. There's no lookup and no decoding trick, just one more matrix multiply.
- **Full model end-to-end:** lookup table → matrix multiplies (+ a few simple ops) → one final matrix multiply with vocab-many outputs.

### How the three matrices are "learned exactly"

- There's no special mechanism per matrix. Everything is one bag of numbers: random init → forward pass → loss → backprop assigns every individual weight a gradient ("would nudging this number help?") → tiny step → repeat.
- Roles aren't assigned. They emerge from wiring position: W_q's output is always the thing looking, W_k's is the thing scored, and W_v's is the thing averaged.

### Why W_q and W_k get different gradients despite reading the same x

- **Core fact:** the derivative of a product with respect to one factor is the other factor. In `score = q·k`, each matrix's gradient is computed THROUGH the other's output: ∂L/∂W_q contains K, and ∂L/∂W_k contains Q.
- **Random init breaks the symmetry:** if they started identical, their gradients would match and they'd stay clones forever. Different starts → different gradients from step 1 → the divergence compounds.
- **W_v is structurally different:** its gradient path runs through the softmax's output (`wei @ v`), not through the scores. Different wiring, different formula.

### Notes on attention

Attention is a communication mechanism.

- It can be seen as nodes in a directed graph pointing at each other. Each node holds a vector of information and aggregates info via a weighted sum from all the other nodes pointing at it.
- There is no notion of space. Attention simply acts over a set of vectors, so we encode them positionally.
- Each example across the batch dimension is processed completely independently.
- **Self-attention** just means the keys and values are produced from the same source as the queries. In **cross-attention**, the query is produced from x, but the keys and values come from some other external source (e.g. an encoder module).
- In an **encoder** attention block, just delete the single line that does masking with `tril` (lower triangular), which allows all tokens to communicate. Our **decoder** attention block has triangular masking and is usually used in autoregressive settings.

### *Attention Is All You Need*

- V is what aggregates the values.
- `d_k` is the head size.
- Scaling by `1/sqrt(head_size)` keeps the variance of the weights at 1 (preserved).

## Building the transformer

17. Insert a single self-attention head into our network.
18. **Multi-head attention:** apply heads in parallel and concatenate the results.
    - We'll do 4 heads of 8-dimensional self-attention that concatenate to 32 = `n_embd`.
    - It helped to have multiple communication channels for different types of data (vowels, consonants, etc.).
19. After self-attending (gathering the data), **feed forward** through a multi-layer perceptron. The model needs time to "think" about the gathered data before calculating the logits.
20. **Transformer block:** intersperses communication and computation.

### Residual / skip connections

- Stacking many layers means gradients must flow backward through every one of them to reach the early layers. Each layer's transformations degrade the signal until it's noise (vanishing gradient).
- Instead of `x = block(x)`, where the output replaces the input, we do `x = x + block(x)`. This adds to the input, "skipping" around the block and rejoining after.
- The block no longer computes the new representation. Instead, it computes an adjustment to the existing one (the residual). The running x becomes a highway that flows through the whole network untouched.

### Still to cover

- LayerNorm
- Scaling up the model, adding dropout

### Notes on the transformer

- **Encoder vs. decoder vs. both:** the original paper used a cross-attention architecture, with keys/values coming out of an encoder, for language translation.

![Transformer architecture diagram from Attention Is All You Need](/writing/transformer-architecture.png "The original transformer: encoder (left), decoder (right)")

## Appendix: torch.Tensor

```python
import torch

# Initialize a tensor on a chosen device
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], dtype=torch.float32, device="cpu", requires_grad=True)

print(x.dtype)          # torch.float32
print(x.device)         # cpu
print(x.layout)         # torch.strided
print(x.shape)          # torch.Size([2, 2])
print(x.ndim)           # 2
print(x.requires_grad)  # True
```
