//Hosting URL: https://musicmaker-4b2e8.firebaseapp.com
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_YwuqJTfx2ZxOo4hGqGQSnoP3');

firebase.initializeApp({
    apiKey: "AIzaSyCls0XUsqzG0RneHcQfwtmfvoOqHWojHVM",
    authDomain: "musicmaker-4b2e8.firebaseapp.com",
    databaseURL: "https://musicmaker-4b2e8.firebaseio.com",
    projectId: "musicmaker-4b2e8",
    storageBucket: "musicmaker-4b2e8.appspot.com",
    messagingSenderId: "849993185408"
});

const db = firebase.firestore();

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({projectId: "musicmaker-4b2e8"});
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const app = express();
app.use(express.json());
app.use(cors());

//===============================================================================================================================================

// TEST for sanity checks ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
app.get('/test', (req, res) => {
    res.status(200).send({MESSAGE: 'HELLO FROM THE BACKEND! :) Visit our Website: https://musicmaker-4b2e8.firebaseapp.com/'});
});

//STUDENT LIST: GET %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//GET should retrieve a teacher's list of students
//details: name, instrument, level
// try nested where queries to search for the students that match the teacher's id ?????????????????????
app.get('/teacher/:idTeacher/students', async (req, res, next) => {
  try{
    const teacherId = req.params['idTeacher'];
    const assignments = {};  

    const assignmentRef =  await db.collection('students');
    const allAssignments = await assignmentRef.get()
    .then(snap => {
      snap.forEach(doc => {
            
      })
    });
    res.json(assignments);   

  }
  catch(err) {
   next(err);
 }
});


// UNGRADED ASSIGNMENTS : POST - GET (All & Single Ungraded Assignment) %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// POST should create and add a new ungraded assignment under a teacher
// details: assignmentName, instructions, instrument, level, piece
// sheetMusic is currently not included, need to figure out how it would be uploaded in the database storage, may need its own endpoint
app.post('/teacher/:idTeacher/createAssignment', (req, res, next) => {
  try {
    const teacherId = req.params['idTeacher'];
    const { assignmentName, instructions, instrument, level, piece, sheetMusic } = req.body;
    // const assignments = {};

    if (!assignmentName || !instructions || !instrument || !level || !piece) {
      res.status(411).send({REQUIRED: 'YOU MUST HAVE ALL FIELDS FILLED'});
    } 
    // else if (assignmentName > 0) {
    //   const teacherAssingmentsRef = await db.collection('teachers').doc(teacherId).collection('assignments').get()
    //   // console.log('0******************************************', teacherAssingmentsRef)
    //   // console.log('1******************************************', Object.keys(teacherAssingmentsRef))
    //   .then(snap => {
    //     snap.forEach(doc => {
    //       global = doc.data();
    //       assignments[doc.id] = [global.assignmentName];
    //     })
    //   })

    //   console.log('2**********************************', assignment) // This returns a list of an array of a teachers assignments within an array, 
    //                                                                  //need to check if each of those assignment names matches the new name and if does throw an error
    //   res.status(411).send({ERROR: 'YOU CANNOT HAVE AN ASSIGNMENT WITH THE SAME NAME'});
    // } 
    else {
      const addTeacherAssign = db.collection('teachers').doc(teacherId).collection('assignments').add({
        'assignmentName': assignmentName,
        'instructions': instructions,
        'instrument': instrument,
        'level': level,
        'piece': piece
      });
      res.status(200).send({MESSAGE: 'YOU HAVE SUCCESSFULLY CREATED A NEW ASSIGNMENT'});
    };
  }
   catch(err) {
    next(err);
  }
});

//GET should retrieve teacher's all ungraded assignments
//details: assignmentName, instructions, instrument, level, piece, sheetMusic
app.get('/teacher/:idTeacher/assignments', (req, res, next) => {
  try{
      const teacherId = req.params['idTeacher'];
      const assignments = {};  

      const assignmentRef =  db.collection('teachers').doc(teacherId).collection('assignments');
      const allAssignments = assignmentRef.get()
      .then(snap => {
        snap.forEach(doc => {
          assignments[doc.id] = doc.data();
        })
        res.status(200).json(assignments);
      });

  } catch (err){
    next (err);
  }
});

//GET should retrieve teacher's ungraded assignment
//details: assignmentName, instructions, instrument, level, piece
//sheetMusic will be retrieved in another endpoint below
app.get('/teacher/:idTeacher/assignment/:idAssignment', (req, res, next) => {
  try{
      const teacherId = req.params['idTeacher'];
      const assignmentId = req.params['idAssignment'];

      const assignmentRef =  db.collection('teachers').doc(teacherId).collection('assignments').doc(assignmentId);
      const getDoc = assignmentRef.get()
      .then(doc => {
        res.status(200).json(doc.data());
      });

  } catch (err){
    next (err);
  }
});

//SETTINGS : POST - GET - PUT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//POST should create and add a new teacher settings info.: email and name
app.post('/teachers/add', (req, res, next) => {
  try {
    // const email = req.body.email;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;
    const {email, firstName, lastName, prefix} = req.body;
    const data = { email, firstName, lastName };

    if(!email) {
      res.status(411).send({ error: 'Please fill out all required fields. Email address is missing.' });
    } else if(!firstName || !lastName) {
      res.status(411).send({ error: 'Please fill out all required fields. First and/or last name is missing.' });
    } else {
      const teachersRef = db.collection('teachers').add({
        'email': email,
        'name': {
          'firstName': firstName,
          'lastName': lastName,
          'prefix': prefix
        }
      });
      res.status(200).send({ message: 'Teacher successfully added!' })
      // res.json({
      //   id: teachersRef.id,
      //   data
      // }); 
    }
  }
   catch(err) {
    next(err);
  }
});

//GET should retrieve teachers settings info.: email and name(first, last, and prefix)
app.get('/teacher/:idTeacher/settings', (req, res, next) => {
  try{
    const teacherId = req.params['idTeacher'];
    const settings = {};

    const settingsRef = db.collection('teachers').doc(teacherId);
    const getSettings = settingsRef.get()
    .then(doc => {
      res.status(200).json(doc.data());
    })

  } catch (err){
    next (err);
  }
});

//PUT should update teachers settings info.: email and name(first, last, and prefix)
app.put('/teacher/:idTeacher/settingsEdit', (req, res, next) => {
  try{
    const teacherId = req.params['idTeacher'];
    const {email, firstName, lastName, prefix} = req.body;

    if (!email) {
      res.status(411).send({REQUIRED: `EMAIL CANNOT BE LEFT BLANK, ENTER A VALID EMAIL`});
    } else if (!firstName || !lastName) {
      res.status(411).send({REQUIRED: `FIRST NAME AND LAST NAME CANNOT BE LEFT BLANK`});
    } else{
     const settingsRef = db.collection('teachers').doc(teacherId).update({
        'email': email,
        'name' : {
          'firstName': firstName,
          'lastName': lastName,
          'prefix': prefix
        }
      });
      res.status(200).send({MESSAGE: 'YOU HAVE SUCCESSFULLY UPDATED YOUR SETTINGS INFORMATION'})  
    }
 
  } catch (err){
    next (err);
  }
});

// STRIPE IMPLEMENTATION %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.post('/charge', async (req, res) => {
  console.log(req.body.token.id); 
  try {
    let { status } = await stripe.charges.create({
      amount: 50,
      currency: 'usd',
      description: 'teacher subscription',
      source: req.body.token.id
    });

    // right here, mark the user as paid in the db

    res.status(201).json({ status });
  } catch(err) {
    res.status(500).send(err);
  }
});



// CODE THAT WE ARE NOT READY TO DELETE========================================================================================================
// GET a QR code

// app.get('/qrcode', (req, res, next) => {
//   try {
//     let stringGen = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
//     let code = QRCode.toString(stringGen, function (err, string) {
//       console.log(string);
//       res.json(string);
//     })
//   } catch(err) {
//     next(err);
//   }
// });

// // test GET request, adding key/value pair to Firebase

// app.get('/teachers', async (req, res, next) => {
//   try {
//     const teachersRef = await db.collection('teachers').get();
//     const teachers = [];
//     teachersRef.forEach((doc) => {
//       teachers.push({
//         id: doc.id,
//         data: doc.data
//       });
//     });
//     res.json(teachers);
//   } catch(err) {
//     next(err);
//   }
// });


// app.get('/teachers', (req, res) => {
//   rootRef
//     .child('teachers')
//     .once('value')
//     .then(snapshot => {
//       res.status(200).json(snapshot.val());
//     })
//     .catch(err => {
//       res.status(500).json({ err });
//     });
// });

// GET a list of all students studying under a specific teacher

// // GET a list of all students studying under a specific teacher

// app.get('/teachers/:id', async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     // if(!id) throw new Error('Please provide a teacher ID.');
//     const studentsRef = await db.collection('teachers').doc(id).collection('students').get();
//     const students = [];
//     studentsRef.forEach((doc) => {
//       students.push({
//         id: doc.id,
//         data: doc.data
//       });
//     });
//     res.json(students);
//   } catch (err) {
//     next (err);
//   }
// });


// // GET a list of all assignments listed under a specific teacher
// // can consider changing this to a more high-level 'assignments' endpoint

// app.get('/teachers/:id/assignments', async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     // if(!id) throw new Error('Please provide a teacher ID.');
//     const assignmentsRef = await db.collection('teachers').doc(id).collection('assignments').get();
//     const assignments = [];
//     assignmentsRef.forEach((doc) => {
//       assignments.push({
//         id: doc.id,
//         data: doc.data
//       });
//     });
//     res.json(assignments);
//   } catch(err) {
//     next(err);
//   }
// });

// // GET a list of all assignments for a specific student
// // I can make this into a teachers -> students type endpoint, but it seems unnecessary for now

// app.get('/students/:id/assignments', async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     // if(!id) throw new Error('Please provide a student ID.');
//     const assignmentsRef = await db.collection('students').doc(id).collection('assignments').get();
//     const assignments = [];
//     assignmentsRef.forEach((doc) => {
//       assignments.push({
//         id: doc.id,
//         data: doc.data
//       });
//     });
//     res.json(assignments);
//   } catch(err) {
//     next(err);
//   }
// });

// //GET teacher can get an assignment's sheetMusic(pdf)
// app.get('/teacher/:idTeacher/assigment/:idAssignment/sheetMusic', async (req, res, next) => {
//   try {
//       const teacherId = req.params['idTeacher'];
//       const assignmentId = req.params['idAssignment'];
  
//       const assignmentRef =  await db.collection('teachers').doc(teacherId).collection('assignments').doc(assignmentId).get();

//       const musicSheet = assignmentRef.get("sheetMusic");
//       const segments = musicSheet['0']._key.path.segments
//       const dirName = segments[segments.length -2];
//       const filename = segments[segments.length -1];
//       const options = {
//           destination : 'temp/' + teacherId + '_' + filename,
//       };

//       const bucket = await storage.bucket('musicmaker-4b2e8.appspot.com');
//       await storage.bucket('musicmaker-4b2e8.appspot.com')
//                    .file(dirName + '/' + filename)
//                    .download(options);

//       const displaysFile = await fs.readFile('temp/' + teacherId + '_' + filename, (err, data) => {
//         res.contentType("application/pdf");
//         res.send(data);
//       });

//   } catch (err) {
//   next (err);
//   }
//   });


// POST

// add individual teacher with just an ID

// app.post('/teachers', async (req, res, next) => {
//   try {
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const data = { firstName, lastName };
//     const ref = await db.collection('teachers').doc(id).collection('settings').doc(id);
//     res.json({
//       id: ref.id,
//       data
//     });
//   } catch(err) {
//     next(err);
//   }
// });

// app.post('/teachers/addTest', async (req, res, next) => {
//   (res => {
//     const obj = res;
//     const teacherData = {
//       firstName: obj.firstName,
//       lastName: obj.lastName
//     };
//     return db.collection('teachers').doc(id)
//       .add(teacherData).then(() => {
//         console.log('New teacher added to database!');
//         res.json(teacherData);
//       })
//   });
// });

// app.post('/teachers', (req, res) => {
//   let data = {
//     QRCode: req.QRCode,
//     email: req.email
//   };
//
//   let setTeacher = db.collection('teachers').set(data);
//   res.json(data);
// })



///////////////////////

// PUT

// app.put('/', (req, res) => {
//   console.log('PUT test');
//   res.send('hello!');
// });

///////////////////////

// DELETE

// app.delete('/', (req, res) => {
//   console.log('DELETE test');
//   res.send('hello!');
// });

///////////////////////

//=================================================== STUDENTS =================================================================
// function parseDate(date){
//   const month = date.getMonth() + 1;
//   const day = date.getDate() + 1;
//   const year = date.getFullYear();
//   const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
//   const minute = date.getMinutes() == '0' ? '00' : date.getMinutes();
//   const amPm = date.getHours() >= 12 ? "PM" : "AM";
//   const reformattedDueDate = month + "/" + day + "/" + year + " at " + hour + ":" + minute + " " + amPm
//   return reformattedDueDate;
// };

// // GET list of all of student's assignments, details: assignmentName, dueDate, and status
// app.get('/student/assignments/:idStudent', async (req, res, next) => {
//   try {
//   const studentId = req.params['idStudent'];
//   const assignments = {};

//   const assignmentsRef =  await db.collection('students').doc(studentId).collection('assignments').orderBy('dueDate', 'desc');
//   const allAssignments = await assignmentsRef.get()
//   .then(snap => {
//     snap.forEach(doc => {
//       root = doc.data();
//       reformattedDueDate = parseDate(root.dueDate);
//       assignments[doc.id] = [root.assignmentName, reformattedDueDate, root.status];
//     })
//   })

//   res.json(assignments);

//   } catch(err) {
//   next(err);
//   }
// });

// //GET a single assignment from a student, details: assignmentName, dueDate, teacher, instrument, level, piece, instructions, feedback
// app.get('/student/:idStudent/assigment/:idAssignment', async (req, res, next) => {
//   try {
//       const studentId = req.params['idStudent'];
//       const assignmentId = req.params['idAssignment'];
//       const assignment = {};      

//       const assignmentRef =  await db.collection('students').doc(studentId).collection('assignments').doc(assignmentId);
//       const getDoc = await assignmentRef.get()
//       .then(doc => {
//         root = doc.data();
//         reformattedDueDate = parseDate(root.dueDate);
//         assignment[doc.id] = [root.assignmentName, reformattedDueDate, root.teacher, root.instrument, root.level, root.piece, root.instructions, root.feedback]
//       })

//       res.json(assignment);

//   } catch (err) {
//   next (err);
//   }
//   });

// //GET student can get their sheetMusic(pdf)
// app.get('/student/:idStudent/assigment/:idAssignment/sheetMusic', async (req, res, next) => {
//   try {
//       const studentId = req.params['idStudent'];
//       const assignmentId = req.params['idAssignment'];
  
//       const assignmentRef =  await db.collection('students').doc(studentId).collection('assignments').doc(assignmentId).get();

//       const musicSheet = assignmentRef.get("sheetMusic");
//       const segments = musicSheet['0']._key.path.segments
//       const dirName = segments[segments.length -2];
//       const filename = segments[segments.length -1];
//       const options = {
//           destination : 'temp/' + studentId + '_' + filename,
//       };

//       const bucket = await storage.bucket('musicmaker-4b2e8.appspot.com');
//       await storage.bucket('musicmaker-4b2e8.appspot.com')
//                    .file(dirName + '/' + filename)
//                    .download(options);

//       const displaysFile = await fs.readFile('temp/' + studentId + '_' + filename, (err, data) => {
//         res.contentType("application/pdf");
//         res.send(data);
//       });

//   } catch (err) {
//   next (err);
//   }
//   });

// //GET student can get their recorded video
// app.get('/student/:idStudent/assigment/:idAssignment/video', async (req, res, next) => {
//   try {
//       const studentId = req.params['idStudent'];
//       const assignmentId = req.params['idAssignment'];
  
//       const assignmentRef =  await db.collection('students').doc(studentId).collection('assignments').doc(assignmentId).get();

//       const video = assignmentRef.get("video");
//       const segments = video['0']._key.path.segments;
//       const dirName = segments[segments.length -2];
//       const filename = segments[segments.length -1];
//       const storagePath = dirName + '/' + filename; 
//       const localPath = 'temp/' + studentId + '_' + filename;
//       const options = {
//           destination : localPath,
//       };

//       const bucket = await storage.bucket('musicmaker-4b2e8.appspot.com');
//       await storage.bucket('musicmaker-4b2e8.appspot.com')
//                    .file(storagePath)
//                    .download(options);

//       const displaysVideo = await fs.readFile(localPath, (err, data) => {
//         res.contentType("video/mov");
//         res.send(data);
//       });

//   } catch (err) {
//   next (err);
//   }
//   });


//=============================================================================================================================================
app.listen(8000, function () {
    console.log(`========================= RUNNING ON PORT 8000 =========================`);
});

exports.app = functions.https.onRequest(app);
  
