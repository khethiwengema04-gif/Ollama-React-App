import React, { useState } from "react";
import './PromptInput.module.css'

interface PromptInputProps {
    onSend: (prompt: string) => void;
    loading?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
    onSend,
    loading = false,
}) => {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt.trim() || loading) return;

        onSend(prompt.trim());
        setPrompt("");
    };

    return (
        <form className="prompt-container" onSubmit={handleSubmit}>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask KHEPIA AI anything..."
                disabled={loading}
            />

            <button
                type="submit"
                disabled={!prompt.trim() || loading}
            >
                {loading ? "Thinking..." : "Send"}
            </button>
        </form>
    );
};

export default PromptInput;
