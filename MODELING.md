# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores user accounts with credentials. Each user owns projects, tasks, and notes.
- **projects** — Containers that group tasks. Each project belongs to one user (via ownerId reference). Can be archived.
- **tasks** — Individual work items within a project. Contains embedded subtasks array and tags array. References a project and owner via ObjectId.
- **notes** — Standalone or project-attached notes owned by a user. Contains an embedded tags array for filtering.


---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):


### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  projectId: ObjectId (required, references projects._id),
  title: string (required),
  status: string (required, one of "todo" | "in-progress" | "done"),
  priority: number (required, default 1),
  tags: string[] (required, default []),
  subtasks: [{ title: string, done: boolean }] (required, default []),
  dueDate: Date (optional — schema flexibility example),
  createdAt: Date (required)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  projectId: ObjectId (optional, references projects._id),
  title: string (required),
  content: string (required),
  tags: string[] (required, default []),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                      | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |      Embed          |  Subtasks are always read/written with their parent task and don't exist independently.    |
| Tags on a task                    |      Embed          |Tags are small strings owned by the task, always fetched together.      |
| Project → Task ownership          |      Reference      |Tasks are queried independently, can be large in number, and need their own indexes.      |
| Note → optional Project link      |      Reference      |The link is optional, and notes can exist without a project.      |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

The dueDate field exists on some task documents but not all. This is acceptable in MongoDB because documents in the same collection don't need identical fields. Its useful because not every task has a deadline, storing null in SQL is wasteful and requires a column, while MongoDB simply omits the field, keeping documents lean.
