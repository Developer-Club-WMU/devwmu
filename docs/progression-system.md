# Developer Club WMU: Progression & Gamification System

This document outlines the architecture and logic of the club's member progression system, commonly referred to as the **XP & Leveling System**.

## 1. Core Logic

The system is designed to reward consistent, high-impact participation. XP is awarded automatically when a member is marked **Attended** by an officer.

### 1.1 The XP Formula
Each event attendance calculates XP using the following base:
```
Total XP = (Base XP × Multiplier) + Additive Bonuses
```

- **Base XP**: Default is **50 XP**.
- **Multiplier**: Combines duration, event tags, and first-time bonuses.
- **Additive Bonuses**: Rewards behavioral traits like consistency and early planning.

---

## 2. Multipliers (Scaling Rewards)

Multipliers increase the value of core participation based on effort and event rarity.

| Component | Logic | Reward |
| :--- | :--- | :--- |
| **Duration** | `min(hours * 0.1, 1.0)` | Up to **+1.0x** |
| **Featured Tag** | Event Tag contains "Featured" | **+0.5x** |
| **Workshop Tag** | Event Tag contains "Workshop" | **+0.3x** |
| **First-Time** | User has no `lastEventDate` | **+0.25x** |

**Example**: A 2-hour Featured Workshop for a new member would have a multiplier of `1 + 0.2 + 0.5 + 0.3 + 0.25 = 2.25x`.

---

## 3. Additive Bonuses (Behavioral Rewards)

Bonuses are added *after* the multiplier to reward specific high-value behaviors.

### 3.1 Attendance Streak
Members are rewarded for attending events on consecutive days.
- **Bonus**: `min(streak * 5, 50)`
- **Max**: +50 XP (Cap)
- **Reset**: A streak resets to 1 if a day is missed.

### 3.2 RSVP Commitment
Rewarding reliability and enabling better planning for officers.
- **Logic**: If `rsvpAt` is ≥ 24 hours before `startTime`.
- **Bonus**: **+10 XP**.

### 3.3 Capacity Pressure
Smaller, high-focus events are prioritized.
- **Capacity ≤ 10**: **+25 XP**.
- **Capacity ≤ 25**: **+15 XP**.

---

## 4. Leveling Curve

We use an exponential growth curve to ensure that higher levels represent significant long-term commitment.

**Formula**: `XP to Next Level = 100 * (Current Level ^ 1.5)`

### Level Milestones & Titles
| Levels | Title | Representative Tier |
| :--- | :--- | :--- |
| 1 - 3 | **ROOKIE** | The starting point. |
| 4 - 7 | **APPRENTICE** | Regular attendee. |
| 8 - 12 | **NINJA** | Core community member. |
| 13 - 20 | **ARCHITECT** | Project contributor. |
| 21+ | **WIZARD** | Senior mentor / high-impact member. |

---

## 5. Technical Implementation

The system is implemented using the **Effect** pattern for robust error handling and decoupling.

- **Domain Layer**: `src/server/core/domain/progression.service.ts`
  - Handles XP calculation, leveling logic, and title assignment.
- **Handler Layer**: `src/server/core/handlers/app/toggle-attendance.handler.ts`
  - Wraps the event attendance toggle with a progression trigger.
- **Schema**: `prisma/schema.prisma`
  - `User` model extended with `streak`, `xp`, `level`, `title`, and `lastEventDate`.

## 6. Future Expansion Ideas
- **Variety Bonus**: Tracking different event tags over a rolling 7-day period.
- **Role-Based Multipliers**: Bonus for taking specialized roles during projects.
- **Leaderboards**: A global list categorized by level and project impact.
