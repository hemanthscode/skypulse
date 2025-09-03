# ⚡ Sky Pulse - Weather Dashboard

<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Sky%20Pulse&fontSize=50&animation=fadeIn)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=36BCF7&center=true&vCenter=true&width=600&lines=Real-time+Weather+Insights+%E2%9A%A1;Global+Coverage+%F0%9F%8C%8D;Enhanced+Glassmorphism+UI+%E2%9C%A8;Open-Meteo+API+Integration+%F0%9F%93%A1)](https://git.io/typing-svg)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-FF6B6B?style=for-the-badge&logo=vercel&logoColor=white)](https://skypulse07.netlify.app/) [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hemanthscode/skypulse)

</div>

---

## 🌟 Highlights

<div align="center">

| 🚀 **Performance** |  🎨 **Design**   | 🌍 **Coverage** | 📱 **Responsive** |
| :----------------: | :--------------: | :-------------: | :---------------: |
|  Optimized Build   | Glassmorphism UI | Global Weather  |    All Devices    |

</div>

---

## 📚 Table of Contents

- [🌤️ Overview](#️-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [💻 Usage](#-usage)
- [🎯 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📄 License](#-license)

---

## 🌤️ Overview

**Sky Pulse** is a cutting-edge, real-time weather dashboard that delivers precise global weather data through the **Open-Meteo API**. Featuring a sleek **glassmorphism design** with neon accents, it offers an immersive user experience with enhanced search functionality, hourly and daily forecasts, and actionable weather insights.

The project leverages a **local Tailwind CSS build system** for optimized performance and maintainability, ensuring lightning-fast load times and a professional development workflow.

<div align="center">

### 🎯 **Key Stats**

|        Metric        |         Value          |
| :------------------: | :--------------------: |
|   **Bundle Size**    | < 15KB (90% reduction) |
|    **Load Time**     |          < 1s          |
|   **API Response**   |        < 500ms         |
| **Lighthouse Score** |          95+           |

</div>

---

## ✨ Features

### 🌍 **Weather Intelligence**

- 🔄 **Real-Time Data** - Powered by Open-Meteo API for accurate, live updates
- 🔍 **Smart Global Search** - Enhanced autocomplete city search with animations
- ⏰ **12-Hour Forecasts** - Detailed hourly weather predictions
- 📅 **6-Day Outlook** - Extended daily forecasts for planning
- 💡 **Weather Insights** - Contextual recommendations based on conditions

### 🎨 **User Experience**

- ✨ **Glassmorphism UI** - Modern neon-themed cards with dynamic animations
- 📱 **Responsive Design** - Seamless experience across all devices
- ♿ **Accessibility First** - Screen reader support, keyboard navigation
- 🎯 **Reduced Motion** - Respects user preferences for animations
- 🌙 **Performance Optimized** - Local CSS build for faster loading

### 🛡️ **Technical Excellence**

- 📦 **Optimized Build** - 90% smaller CSS bundles with Tailwind
- 🚀 **Modern Stack** - HTML5, ES6+, CSS Grid, Flexbox
- 🔧 **Development Ready** - Hot reload, watch mode, production builds
- 📊 **SEO Optimized** - Meta tags, semantic HTML, structured data

---

## 📂 Project Structure

```
📦 skypulse/
├── 🏠 index.html              # Main HTML structure
├── ⚡ app.js                  # Core JavaScript logic
├── 📁 src/
│   └── 🎨 input.css          # Tailwind directives + custom CSS
├── 📁 dist/
│   └── ✨ output.css         # Compiled CSS (auto-generated)
├── 🗂️ style.css              # Legacy backup (archived)
├── 📋 package.json           # Dependencies & build scripts
├── ⚙️ tailwindcss.config.js  # Tailwind configuration
├── 🌐 netlify.toml           # Deployment configuration
├── 🚫 .gitignore             # Git ignore rules
└── 📦 node_modules/          # Dependencies
```

---

## 🚀 Installation

### **Prerequisites**

- 📦 [Node.js](https://nodejs.org/) (v14 or higher)
- 🌐 Modern web browser
- 💻 Terminal/Command prompt

### **Quick Start**

1. **📥 Clone Repository**

   ```
   git clone https://github.com/hemanthscode/skypulse.git
   cd skypulse
   ```

2. **📦 Install Dependencies**

   ```
   npm install
   ```

3. **🔨 Build CSS**

   ```
   npm run build
   ```

4. **🚀 Start Development**

   ```
   # For development (with watch mode)
   npm run dev

   # For production build
   npm run build
   ```

5. **🌐 Serve Locally**

   ```
   # Python
   python -m http.server 8000

   # Node.js (if you have http-server)
   npx http-server

   # VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

6. **🎉 Open in Browser**
   Navigate to `http://localhost:8000`

---

## 💻 Usage

### 🔍 **Search Experience**

1. **Global City Search** - Type any city name for instant autocomplete suggestions
2. **Keyboard Navigation** - Use arrow keys and Enter for accessibility
3. **Smart Filtering** - Results include country codes and region info

### 📊 **Weather Dashboard**

- **🌡️ Hero Card** - Current temperature, condition, daily high/low
- **💨 Wind Card** - Speed, direction, and pressure readings
- **💧 Humidity Card** - Moisture levels and visibility range
- **☀️ UV Index** - Color-coded safety levels with recommendations
- **🌅 Sun/Moon** - Sunrise, sunset, and daylight duration
- **🌧️ Precipitation** - Rain chances, amounts, and cloud coverage

### ⏰ **Forecast Views**

- **12-Hour Timeline** - Scrollable hourly predictions with weather icons
- **6-Day Outlook** - Daily forecast cards with temperature ranges
- **💡 Smart Insights** - Personalized weather advice and activity suggestions

### 📱 **Responsive Design**

- **Desktop** - Full 6-column grid layout with detailed information
- **Tablet** - 4-column adaptive layout with optimized spacing
- **Mobile** - Single column stack with touch-friendly interactions

---

## 🎯 Development

### **Available Scripts**

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run build`     | 🏗️ Build production CSS (minified) |
| `npm run dev`       | 🔄 Watch mode for development      |
| `npm run build-css` | 👀 Build with watch mode           |

### **Development Workflow**

1. **🎨 Styling Changes**

   - Edit `src/input.css` for custom styles
   - Use Tailwind utilities in HTML
   - Run `npm run dev` for auto-rebuild

2. **⚡ JavaScript Updates**

   - Edit `app.js` directly
   - No build step required for JS

3. **🏗️ Production Build**
   ```
   npm run build
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

### **Custom CSS Layers**

```
@layer base {
  /* Global styles */
}

@layer components {
  /* Reusable components */
}

@layer utilities {
  /* Custom utility classes */
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **📋 Contribution Guidelines**

1. **🍴 Fork the Repository**
2. **🌿 Create Feature Branch**
   ```
   git checkout -b feature/amazing-feature
   ```
3. **💻 Make Your Changes**
4. **🧪 Test Thoroughly**
   - Check responsive design
   - Verify accessibility features
   - Test build process
5. **📝 Commit Changes**
   ```
   git commit -m "✨ Add amazing feature"
   ```
6. **🚀 Push to Branch**
   ```
   git push origin feature/amazing-feature
   ```
7. **🔄 Open Pull Request**

### **🎯 Development Focus Areas**

- 🌟 New weather data visualizations
- 🎨 Enhanced UI/UX improvements
- ♿ Accessibility enhancements
- 📱 Mobile experience optimization
- 🔧 Performance improvements

---

## 📞 Support

<div align="center">

### **Get Help & Connect**

[![GitHub Issues](https://img.shields.io/badge/Issues-GitHub-red?style=for-the-badge&logo=github)](https://github.com/hemanthscode/skypulse/issues)
[![GitHub Profile](https://img.shields.io/badge/Profile-hemanthscode-blue?style=for-the-badge&logo=github)](https://github.com/hemanthscode)

**🐛 Bug Reports** • **💡 Feature Requests** • **❓ Questions** • **🤝 Collaboration**

</div>

---

## 📄 License

<div align="center">

**MIT License** - Feel free to use this project for learning, personal use, or commercial purposes.

See the [LICENSE](LICENSE) file for details.

---

### **⭐ Show Your Support**

If this project helped you, please consider giving it a ⭐ on GitHub!

**Built with ❤️ by [hemanthscode](https://github.com/hemanthscode)**

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)

</div>
