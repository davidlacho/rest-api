'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sandbox');

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log('DB connection success');
  // All db communication goes here.

  const Schema = mongoose.Schema;

  const AnimalSchema = new Schema({
    type: {
      type: String,
      default: "goldfish"
    },
    color: {
      type: String,
      default: "golden"
    },
    mass: {
      type: Number,
      default: "0.007"
    },
    name: {
      type: String,
      default: "Angela"
    },
    size: String
  });

  AnimalSchema.pre("save", function(next) {
    if (this.mass >= 100) {
      this.size = "big";
    } else if (this.mass >= 5 && this.mass < 100) {
      this.size = "medium";
    } else {
      this.size = "small";
    }
    next();
  });

  AnimalSchema.methods.findSameColor = function(callback) {
    // this == document
    return this.model("Animal").find({
      color: this.color
    }, callback)
  };

  AnimalSchema.statics.findSize = function(animalSize, callback) {
    return this.find({
      size: animalSize
    }, callback);
  };

  const Animal = mongoose.model("Animal", AnimalSchema);

  const elephant = new Animal({
    type: 'elephant',
    color: 'grey',
    mass: 6000,
    name: 'Lawrence'
  });

  const whale = new Animal({
    type: 'whale',
    color: 'grey',
    mass: 190500,
    name: 'Fig'
  });

  const animal = new Animal({});

  const animalData = [{
      type: "mouse",
      color: "gray",
      mass: 0.035,
      name: "Marvin"
    },
    {
      type: "nutria",
      color: "brown",
      mass: 6.35,
      name: "Gretchen"
    },
    {
      type: "wolf",
      color: "grey",
      mass: 45,
      name: "Iris"
    },
    elephant,
    animal,
    whale
  ];

  Animal.remove({}, () => {
    Animal.create(animalData, (err, animals) => {

      if (err) {
        console.log(err);
      }


      Animal.findOne({
        type: "elephant"
      }, function(err, elephant) {
        if (err) {
          console.log(err)
        }
        elephant.findSameColor(function(err, animals) {
          if (err) {
            console.log(err);
          }
          animals.forEach(function(animal) {
            console.log(`${animal.name} the ${animal.size} ${animal.color} ${animal.type}`);

          });
          db.close(() => {
            console.log('connection closed');
          });


          // Animal.findSize("big", (error, data) => {
          //   if (error) {
          //     console.log(error);
          //   } else {
          //     data.forEach((animal) => {
          //       console.log(`${animal.name} the ${animal.size} ${animal.color} ${animal.type}`);
          //     });
          //     db.close(() => {
          //       console.log('connection closed');
          //     });
          //   }
          // });


        })
      });






    });
  });
});
