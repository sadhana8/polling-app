/** @type {import('tailwindcss').config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
    extend: {
        colors: {
            primary: "#00bfa6",
            secondary: "#EF863E",
        },

        backgroundImage: {
            'auth-bg-img': "url('./src/assets/images/auth-img.png')",
            'profile-bg--img': "url('./src/assets/images/profile-bg.png')",
        }
    },
},
plugins: [],
}