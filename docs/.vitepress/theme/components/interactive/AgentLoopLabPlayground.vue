<script setup lang="ts">
import PythonPlayground from "../PythonPlayground.vue";
const code=`from dataclasses import dataclass, field

@dataclass
class Run:
    state: str = 'READY'
    attempts: int = 0
    approved: bool = False
    events: list = field(default_factory=list)

def transition(run, scenario):
    run.events.append(run.state)
    if run.state == 'READY': run.state = 'VALIDATING'
    elif run.state == 'VALIDATING':
        run.state = 'WAITING_APPROVAL' if scenario == 'write' and not run.approved else 'RUNNING'
    elif run.state == 'WAITING_APPROVAL':
        run.approved = True; run.state = 'RUNNING'
    elif run.state == 'RUNNING':
        run.attempts += 1
        if scenario == 'timeout' and run.attempts == 1: run.state = 'RETRY_WAIT'
        else: run.state = 'COMPLETED'
    elif run.state == 'RETRY_WAIT': run.state = 'RUNNING'
    else: raise RuntimeError('terminal state')

def execute(scenario):
    run = Run()
    while run.state not in {'COMPLETED','FAILED','CANCELLED'}:
        transition(run, scenario)
        assert len(run.events) <= 8
    run.events.append(run.state)
    return run

success = execute('read')
timeout = execute('timeout')
write = execute('write')
print('read:', ' -> '.join(success.events))
print('timeout:', ' -> '.join(timeout.events))
print('write:', ' -> '.join(write.events))
assert timeout.attempts == 2
assert 'WAITING_APPROVAL' in write.events and write.approved
assert all(run.state == 'COMPLETED' for run in [success, timeout, write])
print('all state paths closed')`;
</script>
<template><PythonPlayground title="运行成功、重试与审批状态机" :code="code" /></template>
