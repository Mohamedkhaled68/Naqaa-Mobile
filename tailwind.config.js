/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0D3B66",
                    light: "#1E5A8A",
                    dark: "#092B4A",
                },
                accent: {
                    DEFAULT: "#F4D35E",
                    light: "#FFE88A",
                },
                success: "#2ECC71",
                warning: "#F39C12",
                error: "#E74C3C",
                info: "#3498DB",

                background: {
                    light: "#F9FAFB",
                    dark: "#121212",
                    card: "#FFFFFF",
                },

                text: {
                    primary: "#1F2937",
                    secondary: "#4B5563",
                    muted: "#9CA3AF",
                    onDark: "#F9FAFB",
                },

                border: "#E5E7EB",
                input: "#F3F4F6",
            },
        },
    },
    plugins: [],
};
