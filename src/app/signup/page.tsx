"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Form, Container, Card, Spinner } from "react-bootstrap";
import { FaUserAlt, FaLock } from "react-icons/fa";

const SignupPage = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Signup successful! Redirecting...");
                setError(null);
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setError(data.message || "Signup failed");
                setMessage(null);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{
            background: "linear-gradient(to right, #667eea, #764ba2)",
        }}>
            <Card className="p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "420px", background: "#ffffff", border: "none" }}>
                <Card.Title className="text-center mb-3 fs-2 fw-bold text-primary">
                    Create an Account
                </Card.Title>

                {message && <Alert variant="success" className="text-center">{message}</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Name</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <FaUserAlt />
                            </span>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                className="form-control-lg"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <FaUserAlt />
                            </span>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="form-control-lg"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <FaLock />
                            </span>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                className="form-control-lg"
                            />
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3 py-3 fs-5 rounded-3 shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
                    </Button>

                    <p className="text-center mt-3">
                        Already have an account? 
                        <Button variant="link" className="p-0 text-primary fw-bold" onClick={() => router.push("/login")}>
                            Login here
                        </Button>
                    </p>
                </Form>
            </Card>
        </div>
    );
};

export default SignupPage;