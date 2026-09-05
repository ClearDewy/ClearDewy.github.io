<script setup lang="ts">
import PythonPlayground from "../PythonPlayground.vue";
const code=`from math import sqrt

cases = [
 {'id':'q1','expected':'2025-01-01','answer':'2025-01-01','citation_ok':True,'risk':'read'},
 {'id':'q2','expected':'2024-07-01','answer':'2024-01-01','citation_ok':True,'risk':'read'},
 {'id':'q3','expected':None,'answer':None,'citation_ok':True,'risk':'read'},
 {'id':'q4','expected':'approved','answer':'approved','citation_ok':True,'risk':'delete'},
]

def pass_case(row):
    correct = row['answer'] == row['expected']
    evidence = row['citation_ok']
    boundary = row['risk'] == 'read'
    return correct and evidence and boundary

results = [pass_case(row) for row in cases]
for row, ok in zip(cases, results):
    print(row['id'], 'PASS' if ok else 'FAIL')

n = len(results); successes = sum(results); p = successes / n; z = 1.96
denom = 1 + z*z/n
center = (p + z*z/(2*n)) / denom
margin = z*sqrt((p*(1-p)+z*z/(4*n))/n) / denom
print('pass_rate:', round(p, 3))
print('95% Wilson interval:', (round(center-margin, 3), round(center+margin, 3)))
assert results == [True, False, True, False]
assert not pass_case(cases[3])  # high-risk action is blocked without approval
print('evaluation and boundary assertions passed')`;
</script>
<template><PythonPlayground title="运行固定评测并注入高风险动作" :code="code" /></template>
