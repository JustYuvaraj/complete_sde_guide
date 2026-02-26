import { useTheme } from "../../shared/ThemeContext";

export default function Footer({ children }) {
    const { theme } = useTheme();
    return (
        <div style={{
            textAlign: "center", padding: "30px 20px 40px",
            borderTop: `1px solid ${theme.footerBorder}`, color: theme.footerText, fontSize: "0.75rem",
        }}>
            {children}
        </div>
    );
}
