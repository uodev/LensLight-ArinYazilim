import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Photo from "../models/photoModel.js"

const createUser = async (req, res) => {
  try {
    await User.create(req.body)
    res.status(201).json({ user: user._id })
  } catch (err) {
    let errors = {}

    if (err.code === 11000) {
      errors.email = "The email already register"
    }

    if (err.name === "ValidationError") {
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message
      })
    }

    res.status(400).json({
      errors,
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    let same = false
    if (user) {
      same = await bcrypt.compare(password, user.password)
    } else {
      return res.status(401).json({
        succeded: false,
        error: "user not found",
      })
    }

    if (same) {
      const token = createToken(user._id)
      res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
      res.redirect("/users/dashboard")
    } else {
      res.status(401).json({
        succeded: false,
        error: "wrong password",
      })
    }
  } catch (e) {
    res.status(500).json({
      succeded: false,
      e,
    })
  }
}

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECTRET, {
    expiresIn: "1d",
  })
}

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: res.locals.user._id })
  const user = await User.findById({ _id: res.locals.user._id }).populate([
    "followers",
    "followings",
  ])
  res.render("dashboard", { link: "dashboard", photos, user })
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.user._id } })
    res.status(200).render("users", {
      users,
      link: "users",
    })
  } catch (e) {
    res.status(500).json({
      succeded: false,
      e,
    })
  }
}

const getAUsers = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id })

    const inFollowers = user.followers.some((follower) => {
      return follower.equals(res.locals.user._id)
    })

    const photos = await Photo.find({ user: req.params.id })
    res.status(200).render("user", {
      user,
      photos,
      link: "users",
      inFollowers,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      succeded: false,
      e,
    })
  }
}
//! Biz takip ediyoruz, takipçi ise takip edilen
const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { $push: { followers: res.locals.user._id } },
      { new: true }
    )

    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      { $push: { followings: req.params.id } },
      { new: true }
    )

    res.status(200).redirect("back")
  } catch (e) {
    console.log(e)
    res.status(500).json({
      succeded: false,
      e,
    })
  }
}

const unfollow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { $pull: { followers: res.locals.user._id } },
      { new: true }
    )

    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      { $pull: { followings: req.params.id } },
      { new: true }
    )

    res.status(200).redirect("back")
  } catch (e) {
    console.log(e)
    res.status(500).json({
      succeded: false,
      e,
    })
  }
}

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAllUsers,
  getAUsers,
  follow,
  unfollow,
}
