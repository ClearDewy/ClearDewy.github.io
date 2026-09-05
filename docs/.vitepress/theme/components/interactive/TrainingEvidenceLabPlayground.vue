<script setup lang="ts">
import PythonPlayground from "../PythonPlayground.vue";
const code = `import hashlib

records = [
    {'id':'train-1','split':'train','source':'book-v1:p10','text':'2 + 3 = 5'},
    {'id':'train-2','split':'train','source':'book-v1:p11','text':'4 + 1 = 5'},
    {'id':'eval-1','split':'eval','source':'quiz-v2:q7','text':'2+3=5'},
]

def normalize(text):
    return ''.join(text.split()).lower()

for row in records:
    row['normalized_hash'] = hashlib.sha256(normalize(row['text']).encode()).hexdigest()[:12]

train_hashes = {row['normalized_hash'] for row in records if row['split'] == 'train'}
leaks = [row['id'] for row in records if row['split'] == 'eval' and row['normalized_hash'] in train_hashes]
print('normalized duplicate leaks:', leaks)
assert leaks == ['eval-1']

tokens = ['<user>', '2+3?', '</user>', '<assistant>', '5', '</assistant>']
loss_mask = [0, 0, 0, 0, 1, 1]
assert len(tokens) == len(loss_mask)
assert [token for token, keep in zip(tokens, loss_mask) if keep] == ['5', '</assistant>']
print('SFT targets:', [token for token, keep in zip(tokens, loss_mask) if keep])

preferences = [
    {'prompt':'2+3?', 'chosen':'5', 'rejected':'6'},
    {'prompt':'4+1?', 'chosen':'5', 'rejected':'4'},
]
for pair in preferences:
    assert pair['chosen'] != pair['rejected']
    assert pair['prompt'].strip()
print('preference pairs:', len(preferences))
print('audit passed')`;
</script>
<template><PythonPlayground title="审计切分、SFT mask 与偏好对" :code="code" /></template>
