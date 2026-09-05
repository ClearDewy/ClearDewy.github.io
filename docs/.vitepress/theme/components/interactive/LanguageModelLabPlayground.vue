<script setup lang="ts">
import PythonPlayground from "../PythonPlayground.vue";

const code = `from math import exp, log
from random import Random

sequences = ['^abab$', '^abab$', '^ab$', '^abab$']
vocab = sorted(set(''.join(sequences)))
token_to_id = {token: index for index, token in enumerate(vocab)}
pairs = [(left, right) for sequence in sequences for left, right in zip(sequence, sequence[1:])]

size = len(vocab)
logits = [[0.0 for _ in range(size)] for _ in range(size)]

def softmax(row, temperature=1.0):
    scaled = [value / temperature for value in row]
    peak = max(scaled)
    values = [exp(value - peak) for value in scaled]
    total = sum(values)
    return [value / total for value in values]

learning_rate = 0.8
for epoch in range(401):
    gradients = [[0.0 for _ in range(size)] for _ in range(size)]
    loss = 0.0
    for current, target in pairs:
        row = token_to_id[current]
        target_id = token_to_id[target]
        probabilities = softmax(logits[row])
        loss -= log(probabilities[target_id])
        for candidate in range(size):
            gradients[row][candidate] += probabilities[candidate] - (candidate == target_id)
    loss /= len(pairs)
    for row in range(size):
        for column in range(size):
            logits[row][column] -= learning_rate * gradients[row][column] / len(pairs)
    if epoch in (0, 100, 200, 400):
        print(f'epoch={epoch:3d} loss={loss:.4f}')

for token in vocab:
    probabilities = softmax(logits[token_to_id[token]])
    assert abs(sum(probabilities) - 1.0) < 1e-12
    best = vocab[max(range(size), key=lambda index: probabilities[index])]
    print(token, '->', best, [round(value, 3) for value in probabilities])

def generate(seed=7, temperature=0.7, max_tokens=12):
    random = Random(seed)
    current = '^'
    output = []
    for _ in range(max_tokens):
        probabilities = softmax(logits[token_to_id[current]], temperature)
        point = random.random()
        cumulative = 0.0
        selected = vocab[-1]
        for token, probability in zip(vocab, probabilities):
            cumulative += probability
            if point <= cumulative:
                selected = token
                break
        if selected == '$':
            return ''.join(output)
        output.append(selected)
        current = selected
    return ''.join(output)

sample = generate()
print('sample:', sample)
assert sample in {'ab', 'abab', 'ababab', 'abababab', 'ababababab'}`;
</script>

<template>
  <PythonPlayground title="训练并采样最小 next-token 模型" :code="code" />
</template>
