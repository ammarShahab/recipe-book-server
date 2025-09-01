require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const recipesCollections = client.db("dishdiarydb").collection("recipes");
    // Save data to the database
    app.post("/recipes", async (req, res) => {
      const newRecipe = req.body;
      // console.log(newRecipe);
      const result = await recipesCollections.insertOne(newRecipe);
      res.send(result);
    });

    // show all recipes to the ui
    app.get("/recipes", async (req, res) => {
      const result = await recipesCollections.find().toArray();
      res.send(result);
    });

    // show each recipe details
    app.get("/recipes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollections.findOne(query);
      res.send(result);
    });

    // show top recipe
    app.get("/top-recipes", async (req, res) => {
      const result = await recipesCollections
        .find()
        .sort({ likes: -1 })
        .limit(8)
        .toArray();
      // console.log(result);

      res.send(result);
    });

    // show myrecipes to ui that i added
    app.get("/recipes-email/:email", async (req, res) => {
      // console.log(req.params);

      const email = req.params.email;
      // console.log(email);
      // const query = { email: email };
      const result = await recipesCollections.find({ email: email }).toArray();
      // console.log(result);

      res.send(result);
    });

    // update recipe
    app.put("/recipes/:id", async (req, res) => {
      const { id } = req.params;
      const updatedRecipe = req.body;

      const result = await recipesCollections.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecipe }
      );

      res.send(result);
    });

    // Like route
    app.put("/recipes/:id/like", async (req, res) => {
      try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
          return res
            .status(400)
            .json({ success: false, error: "User ID required" });
        }

        // Fetch recipe
        const recipe = await recipesCollections.findOne({
          _id: new ObjectId(id),
        });

        if (!recipe) {
          return res
            .status(404)
            .json({ success: false, error: "Recipe not found" });
        }

        // Make sure likedBy exists
        let likedBy = Array.isArray(recipe.likedBy) ? recipe.likedBy : [];

        // console.log("likedBy", likedBy);
        // console.log("Arrayis", Array.isArray(likedBy));
        // console.log(recipe);

        // Check if user already liked
        if (likedBy.includes(userId)) {
          return res.json({
            success: false,
            message: "You already liked this recipe",
            likes: recipe.likes,
          });
        }

        // Ensure likes is a number
        let currentLikes = typeof recipe.likes === "number" ? recipe.likes : 0;

        // Increment likes and push userId into likedBy
        const updated = await recipesCollections.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: { likes: currentLikes + 1 },
            $push: { likedBy: userId },
          }
        );

        if (updated.modifiedCount === 0) {
          return res
            .status(400)
            .json({ success: false, error: "Failed to update likes" });
        }

        res.json({
          success: true,
          message: "Recipe liked successfully!",
          likes: currentLikes + 1,
        });
        // console.log("updated recipe", recipe);
      } catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ success: false, error: "Server error" });
      }
    });

    // delete api
    app.delete("/recipes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running recipes in server");
});

app.listen(port, () => {
  console.log(`recipes are running on port ${port}`);
});
