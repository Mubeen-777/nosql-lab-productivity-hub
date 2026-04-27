// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');
const { name } = require('ejs');

(async () => {
  const db = await connect();
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});
  //--------------------users-----------------------------
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password456', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'alice@example.com',
    passwordHash: hash1,
    name: 'Alice Johnson',
    createdAt: new Date()
  });
  const u2 = await db.collection('users').insertOne({
    email: 'bob@example.com',
    passwordHash: hash2,
    name: 'Bob Smith',
    createdAt: new Date()
  });
  //--------------------projects---------------------------
  const p1 = await db.collection('projects').insertOne({
    ownerId: u1.insertedId,
    name: 'project 1',
    description: 'description 1',
    archived: false,
    createdAt: new Date()
  })
  const p2 = await db.collection('projects').insertOne({
    ownerId: u1.insertedId,
    name: 'project 2',
    description: 'description 2',
    archived: false,
    createdAt: new Date()
  })
  const p3 = await db.collection('projects').insertOne({
    ownerId: u2.insertedId,
    name: 'project 3',
    description: 'description 3',
    archived: false,
    createdAt: new Date()
  })
  const p4 = await db.collection('projects').insertOne({
    ownerId: u2.insertedId,
    name: 'project 4',
    description: 'description 4',
    archived: false,
    createdAt: new Date()
  })
  //--------------------tasks----------------------------
  await db.collection('tasks').insertMany([
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId,
      title: 'Write literature review',
      status: 'in-progress',
      priority: 3,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Find 10 papers', done: true },
        { title: 'Summarize findings', done: false }
      ],
      dueDate: new Date('2026-05-15'),
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId,
      title: 'Build prototype',
      status: 'todo',
      priority: 2,
      tags: ['coding'],
      subtasks: [
        { title: 'Setup repo', done: false },
        { title: 'Create wireframes', done: false }
      ],
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      projectId: p2.insertedId,
      title: 'Design blog layout',
      status: 'done',
      priority: 1,
      tags: ['design', 'frontend'],
      subtasks: [
        { title: 'Choose color palette', done: true }
      ],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId,
      title: 'Setup React Native project',
      status: 'done',
      priority: 2,
      tags: ['setup', 'mobile'],
      subtasks: [
        { title: 'Install dependencies', done: true },
        { title: 'Configure ESLint', done: true }
      ],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId,
      title: 'Implement login screen',
      status: 'todo',
      priority: 3,
      tags: ['coding', 'auth'],
      subtasks: [
        { title: 'Design UI', done: false },
        { title: 'Connect to API', done: false }
      ],
      dueDate: new Date('2026-06-01'),
      createdAt: new Date()
    }
  ]);
  //--------------------notes----------------------------
  await db.collection('notes').insertMany([
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId,
      title: 'Meeting notes — advisor',
      content: 'Discussed timeline and milestones for the final year project.',
      tags: ['meeting', 'fyp'],
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      projectId: p2.insertedId,
      title: 'Blog post ideas',
      content: 'Write about MongoDB vs SQL, REST API design patterns.',
      tags: ['ideas', 'writing'],
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      title: 'Random thought',
      content: 'Look into GraphQL for the next project.',
      tags: ['ideas'],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId,
      title: 'Bug tracker',
      content: 'Login screen crashes on Android 12. Need to debug.',
      tags: ['bug', 'mobile'],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      title: 'Book recommendations',
      content: 'Clean Code, Designing Data-Intensive Applications.',
      tags: ['reading', 'ideas'],
      createdAt: new Date()
    }
  ]);
  process.exit(0);
})();
