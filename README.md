# Nexa Board – Task Management Application

A modern full-stack task management application built using **Next.js (App Router)**, **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

---

## 📦 Installation & Setup

### Frontend Setup

```bash
npm install
npm run dev
```

Runs at:

```
http://localhost:3000
```

### Backend Setup

```bash
npm install
npm start
```

Runs at:

```
http://localhost:5000
```

---

## 🧪 Environment Variables

### Frontend `.env.local`

```
NEXT_PUBLIC_BASE_URL=http://localhost:5000
```

### Backend `.env`

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📁 Project Structure

```
/
├── app/                     # App Router pages
├── components/              # UI Components
├── lib/axios.js             # API Configuration
├── styles/                  # Tailwind and global styles
└── public/                  # Static assets
```

---

## 🛠 Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Axios
* JavaScript / TypeScript

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcryptjs

---

## 🚀 Deployment

### Frontend

Deploy using **Vercel**

### Backend

Deploy using:

* Render
* Railway
* DigitalOcean
* Vercel Functions

---

## 📚 Useful Resources

* Next.js Documentation
* Learn Next.js
* Express Documentation
* Tailwind CSS

---

## 🤝 Contributing

Contributions and feature requests are welcome.

---

## 📄 License

Distributed under the MIT License.
