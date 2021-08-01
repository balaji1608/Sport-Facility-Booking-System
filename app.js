var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
const Owner = require("./OwnerSchema.js");
const Booking = require("./BookingSchema.js");
const bcrypt = require("bcrypt"); // copy
var owner_name ;
var sport_name;
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/css", express.static("css"));
app.use("/html", express.static("html"));
app.use("/images", express.static("images"));
app.use("/swiper", express.static("swiper"));
app.use("/js", express.static("js"));
app.use("/icons", express.static("icons"));

//app.use(express.static("/logo"));

var person_name;
var seats_booked = 0;
var date;
mongoose.connect("mongodb://localhost/tickets");


var user_schema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  city: String,
  dbate: Date,
  pwd: String,
  gender: String,
});

var errors = null;

var user = mongoose.model("user", user_schema);

var login = 0;


app.get("/", function (req, res) {
  console.log("INDEX Page");
  login=0
  res.render("index");
});

app.get("/success", function (req, res) {
  if (login === 1) {
    Owner.findOne({user_Name:owner_name},function(err,curr_owner){
      if(err){
        console.log(err)
      }
      else{
        console.log(curr_owner.Infra_Name)
        res.render("success", { person: person_name, owner:curr_owner});

      }
    })
  } else {
    res.render("login_signup");
  }
});

app.get("/owner", function (req, res) {
  res.render("login_signup_owner");
});

app.post("/owner/signup", async function (req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    var data = {
      user_Name: req.body.O_name.toLowerCase(),
      Infra_Name: req.body.i_name.toLowerCase(),
      Sport_Type: req.body.S_type.toLowerCase(),
      Open_Time: req.body.o_slot,
      slots: req.body.slot,
      Area: req.body.area.toLowerCase(),
      M_Num: req.body.num,
      password: hashedPassword,
      email: req.body.mail,
      City: req.body.city.toLowerCase(),
    };
    const owner = new Owner(data);
    owner.save();
    console.log(data);
    res.redirect("/login_signup");
    console.log("Successfully added to database");
  } catch(err) {
    console.log(err);
  }
});

app.get("/payment", function (req, res) {
  if (login === 1) {
    res.render("payment", { person: person_name });
  } else {
    res.render("login_signup");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/tos", function (req, res) {
  res.render("tos");
});

app.get("/privacy", function (req, res) {
  res.render("privacy");
});

app.get("/forgotpassword", function (req, res) {
  res.render("forgotpassword");
});

app.get("/cricket", function (req, res) {
  if (login === 1) {
    res.render("cricket", { person: person_name });
  } else {
    res.render("login_signup");
  }
});

app.get("/confirm-slots", function (req, res) {
  if (login === 1) {
    const bookingdata = {
      owner_user_Name: owner_name,
      player_user_Name: person_name,
      slot_Number: req.query.slotno,
      date: req.query.date,
    };
    console.log(bookingdata)
    const booking = new Booking(bookingdata);
    booking.save();
    Owner.findOne({user_Name:owner_name},function(err,curr_owner){
      if(err){
        console.log(err)
      }
      else{
        console.log(curr_owner.Infra_Name)
        res.render("success", { person: person_name, owner:curr_owner});
      }})
  } else {
    res.render("login_signup");
  }
});

app.get("/find-slots/:sport", function (req, res) {
  if (login === 1) {
    Owner.find({ Sport_Type: req.params.sport }, function (err, owner) {
      if (err) {
        console.log(err);
      } else {
        // login = 0;
        console.log(person_name + owner);
        res.render(req.params.sport, { person: person_name, owners: owner });
        // res.json(owner);
      }
    });
  } else {
    res.render("login_signup");
  }
});

app.post("/check-slots", function (req, res) {
   date = req.body.cdate;
  res.redirect("/check-slots?sport=" +sport_name+"&name="+owner_name+"&cdate="+date);
});

app.get("/check-slots", function (req, res) {
  console.log("p = "+req.query.name + "s = "+req.query.sport)
  if(login === 1)
  {
    Owner.findOne({user_Name:req.query.name}, function (err, owner) {
        if(err){
            console.log(err)
        }
        else {
          if(req.query.cdate)
          {
            Booking.find({$and:[{owner_user_Name:owner.user_Name },{date:req.query.cdate}]},function (err, booked){
                console.log(person_name + owner);
                var bslots = [];
                for(var i=0;i<booked.length;i++)
                {
                  bslots.push(booked[i].slot_Number);
                }
                owner_name = owner.user_Name;
                sport_name = req.query.sport;
             res.render("book", {person: person_name, owners:owner,booked_slots: bslots,sport:req.query.sport,cdate:date});
           });
         }
          else{
          Booking.find({owner_user_Name:owner.user_Name },function (err, booked){
              console.log(person_name + owner);
              var bslots = [];
              for(var i=0;i<booked.length;i++)
              {
                bslots.push(booked[i].slot_Number);
              }
              owner_name = owner.user_Name;
              sport_name = req.query.sport;
           res.render("book", {person: person_name, owners:owner,booked_slots: bslots,sport:req.query.sport,cdate:null});
          })
        }
}
});
}
  else{
    res.render("login_signup");
  }
});

app.get("/badminton", function (req, res) {
  if (login === 1) {
    res.render("badminton", { person: person_name });
  } else {
    res.render("login_signup");
  }
});
app.get("/skating", function (req, res) {
  if (login === 1) {
    res.render("skating", { person: person_name });
  } else {
    res.render("login_signup");
  }
});
app.get("/swimming", function (req, res) {
  if (login === 1) {
    res.render("swimming", { person: person_name });
  } else {
    res.render("login_signup");
  }
});
app.get("/tennis", function (req, res) {
  if (login === 1) {
    res.render("tennis", { person: person_name });
  } else {
    res.render("login_signup");
  }
});
app.get("/home",function(req,res){
  res.render("home",{person: person_name});
})
app.get("/login_signup", function (req, res) {
  console.log("Sign Up Page");
  res.render("login_signup", { su_error: errors });
});

app.get("/logo/logo.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "logo.png"));
});
app.get("/logo/cricket.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "cricket.png"));
});
app.get("/logo/football.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "football.png"));
});
app.get("/logo/badminton.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "badminton.png"));
});
app.get("/logo/skating.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "skating.png"));
});
app.get("/logo/swimming.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "swimming.png"));
});
app.get("/logo/tennis.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "tennis.png"));
});
app.get("/logo/contact.png", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "contact.png"));
});
app.get("/logo/balaji.jpeg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "balaji.jpeg"));
});
app.get("/logo/aditya.jpeg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "aditya.jpeg"));
});
app.get("/logo/tejas.jpeg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "tejas.jpeg"));
});
app.get("/logo/kishan.jpeg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "kishan.jpeg"));
});
app.get("/logo/facilites.jpeg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "facilites.jpeg"));
});
app.get("/logo/shriram.jpg", function (req, res, next) {
  res.sendFile(path.join(__dirname, "logo", "shriram.jpg"));
});

app.get("/book/:movie", function (req, res) {
  console.log(req.params.movie);
  if (login === 1) {
    if (req.params.movie !== "logo.png") {
      movie.find({ name: req.params.movie }, function (err, movie) {
        if (err) {
          console.log(err);
        } else {
          res.render("book", { person: person_name, movie: movie[0] });
        }
      });
    }
  } else {
    res.render("login_signup");
  }
});

app.get("/home", function (req, res) {
  console.log("Home Page");
  if (login === 1) {
    movie.find({}, function (err, movie) {
      if (err) {
        console.log(err);
      } else {
        poster.find({}, function (err, poster) {
          if (err) {
            console.log(err);
          } else {
            res.render("home", {
              person: person_name,
              movie_posters: poster,
              movie_cards: movie,
            });
          }
        });
      }
    });
  } else {
    res.render("login_signup");
  }
});

app.get("/home/:movie", function (req, res) {
  console.log("Page of " + req.params.movie);
  movie.find({ name: req.params.movie }, function (err, movie) {
    if (err) {
      console.log(err);
    } else {
      res.render("movie_page", { person: person_name, movie: movie[0] });
    }
  });
});

app.get("/:movie", function (req, res) {
  if (login === 1) {
    movie.find({ name: req.params.movie }, function (err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.render("movie_page", { movie: movie[0] });
      }
    });
  } else {
    res.render("login_signup");
  }
  console.log("Page of " + req.params.movie);
});

app.post("/signup", async function (req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pwd, 10);
    console.log("Posted to signup");
    console.log(hashedPassword)
    var d = req.body.bdate;
    d = new Date(d);
    user.find({ email: req.body.email }, function (err, usr) {
      if (err) {
        console.log("ERROR");
      } else {
        if (usr.length > 0) {
          console.log(usr);
          console.log(req.body);
          errors = "Email is already in use.";

          res.redirect("/login_signup");
        } else {
          if (req.body.pwd === req.body.rpwd) {
            user.create({
              fname: req.body.fname,
              lname: req.body.lname,
              email: req.body.email,
              city: req.body.city,
              bdate: d,
              pwd: hashedPassword,
              gender: req.body.gender,
            });
            console.log("Recorded Inserted Successfully");
            res.redirect("/home.ejs");
          } else {
            console.log("Error");
            res.redirect("/login_signup");
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/owner/get-bookings",function(req,res){
  if (login === 1) {
    Booking.find({owner_user_Name : owner_name},function(err,curr_bookings){
      if(err){
        console.log(err)
      }
      else{
        res.json(curr_bookings)
        // res.render("show_bookings", { owner: owner_name ,bookings = curr_bookings});

      }
    });

  } else {
    res.render("login_signup");
  }

});

app.post("/pmt", function (req, res) {
  if (login === 1) {
    res.render("payment", { person: person_name });
  } else {
    res.render("login_signup");
  }
});

app.post("/success", function (req, res) {
  res.redirect("/success");
});

app.post("/login", async function (req, res) {
  try {
    user.findOne({ email: req.body.si_email }, async function (err, person) {
      if (err) {
        console.log("ERROR1");
        console.log(err);
      } else {
        if (await bcrypt.compare(req.body.si_pwd, person.pwd)) {
          login = 1;
          person_name = person;
          res.render("home", {
            person: person,
          });
        } else {
          console.log("wrong password");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/owner/login", async function (req, res) {
  try {
    Owner.findOne({ email: req.body.si_email }, async function (err, owner) {
      if (err) {
        console.log("ERROR1");
        console.log(err);
      } else {
        if (await bcrypt.compare(req.body.si_pwd, owner.password)) {
          login = 1;
          owner_name = owner;
          res.render("owner_dashboard", {
            owner: owner
          });
        } else {
          res.render("login_signup_owner")
          console.log("wrong password");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/signout",function(req,res){
  login =0;
  res.render("login_signup")
})


app.get("/owner/signout",function(req,res){
  login =0;
  res.render("login_signup_owner")
})

app.listen(3000, process.env.IP, function () {
  console.log("Local server started");
});
