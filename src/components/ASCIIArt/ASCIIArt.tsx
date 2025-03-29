import React, { useEffect, useState } from "react";
import figlet from "figlet";
import './ASCIIArt.css';
import { Theme } from "../../themes";

interface ASCIIArtProps {
    theme?: Theme;
}

const ASCIIArt: React.FC<ASCIIArtProps> = ({ theme }) => {
    const [asciiText, setAsciiText] = useState<string>("");

    useEffect(() => {
        fetch("/figlet/fonts/Shaded Blocky.flf") // Load from public folder
            .then((res) => res.text())
            .then((fontData) => {
                figlet.parseFont("Shaded Blocky", fontData); // Register the font
                figlet.text("sudoRCE", { font: "Shaded Blocky" as any }, (err, result) => {
                    if (!err) {
                        setAsciiText(result || "");
                    }
                });
            })
            .catch((err) => console.error("Error loading font:", err));
    }, []);

    return (
        <pre className="ascii-art" style={{ color: theme?.foreground || '#00ff00' }}>{asciiText}</pre>
    );
};

export default ASCIIArt;
