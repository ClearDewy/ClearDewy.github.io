from dataclasses import dataclass


@dataclass(frozen=True)
class StudySession:
    topic: str
    minutes: int


sessions = [
    StudySession("Python", 45),
    StudySession("Systems", 60),
    StudySession("Writing", 30),
]

total_minutes = sum(item.minutes for item in sessions)

assert len(sessions) == 3
assert total_minutes == 135

print({"sessions": len(sessions), "minutes": total_minutes})
