import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { EligibilityData } from "../types";
import useAuthStore from "../stores/authStore";

interface EligibilityFormProps {
    embedded?: boolean;
}

interface ValidationErrors {
    [key: string]: string;
}

interface StepValidation {
    isValid: boolean;
    errors: ValidationErrors;
}

// Error message component
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {message}
        </div>
    );
};

// Custom component for comma-separated fields
const CommaSeparatedInput: React.FC<{
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
    label: string;
}> = ({ value, onChange, placeholder, label }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim()) {
                const newArray = [...value, inputValue.trim()];
                onChange(newArray);
                setInputValue("");
            }
        }
    };

    const handleBlur = () => {
        if (inputValue.trim()) {
            const newArray = [...value, inputValue.trim()];
            onChange(newArray);
            setInputValue("");
        }
    };

    const removeItem = (index: number) => {
        const newArray = value.filter((_, i) => i !== index);
        onChange(newArray);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="space-y-2">
                <input
                    type="text"
                    className="input-field"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                />
                {value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {value.map((item, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="ml-2 text-primary-600 hover:text-primary-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <p className="text-xs text-gray-500">
                    Type your entries and press Enter or comma to add them
                </p>
            </div>
        </div>
    );
};

const EligibilityForm: React.FC<EligibilityFormProps> = ({
    embedded = false,
}) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
        {}
    );
    const [formData, setFormData] = useState<Partial<EligibilityData>>({
        user: {
            id: "",
            name: "",
            email: "",
            country: "",
            age: 0,
            educationLevel: "",
        },
        startupAchievements: {
            funding: "",
            traction: "",
            awards: [],
            patents: [],
        },
        media: [],
        speakingExperience: [],
        publications: [],
        references: [],
        usContacts: [],
        documents: {
            resume: null,
            supportingDocuments: [],
        },
    });

    // Pre-populate form with user data
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                user: {
                    ...prev.user!,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                },
            }));
        }
    }, [user]);

    const totalSteps = 7;

    const steps = [
        { id: 1, title: "Basic Info", description: "Name, country, age" },
        { id: 2, title: "Education", description: "Education level" },
        {
            id: 3,
            title: "Startup Achievements",
            description: "Funding, traction, awards",
        },
        {
            id: 4,
            title: "Media & Press",
            description: "Media coverage and press",
        },
        {
            id: 5,
            title: "Speaking & Publications",
            description: "Speaking experience and publications",
        },
        {
            id: 6,
            title: "References",
            description: "References and US contacts",
        },
        {
            id: 7,
            title: "Documents",
            description: "Resume and supporting documents",
        },
    ];

    // Validation functions
    const validateStep = (step: number): StepValidation => {
        const errors: ValidationErrors = {};

        switch (step) {
            case 1:
                if (!formData.user?.name?.trim()) {
                    errors.name = "Full name is required";
                }
                if (!formData.user?.email?.trim()) {
                    errors.email = "Email address is required";
                } else if (!/\S+@\S+\.\S+/.test(formData.user.email)) {
                    errors.email = "Please enter a valid email address";
                }
                if (!formData.user?.country?.trim()) {
                    errors.country = "Country of origin is required";
                }
                if (
                    !formData.user?.age ||
                    formData.user.age < 18 ||
                    formData.user.age > 100
                ) {
                    errors.age = "Please enter a valid age (18-100)";
                }
                break;

            case 2:
                if (!formData.user?.educationLevel?.trim()) {
                    errors.educationLevel = "Education level is required";
                }
                break;

            case 3:
                if (!formData.startupAchievements?.funding?.trim()) {
                    errors.funding = "Funding information is required";
                }
                if (!formData.startupAchievements?.traction?.trim()) {
                    errors.traction =
                        "Company traction information is required";
                }
                break;

            // Steps 4-7 are optional, no validation needed
            default:
                break;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    const isStepValid = (step: number): boolean => {
        return validateStep(step).isValid;
    };

    const canProceedToNext = (): boolean => {
        return isStepValid(currentStep);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear validation errors when user starts typing
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleUserInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            user: {
                ...prev.user!,
                [field]: value,
            },
        }));

        // Clear validation errors when user starts typing
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleNext = async () => {
        // Validate current step
        const validation = validateStep(currentStep);

        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        // Clear validation errors if step is valid
        setValidationErrors({});

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit form and call EB1A assessment API
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Get auth token
            const token = localStorage.getItem("token");

            // Prepare data for API
            const assessmentData = {
                name: formData.user?.name || "",
                countryOfOrigin: formData.user?.country || "",
                achievements: formData,
            };

            // Call EB1A assessment API
            const response = await fetch(
                "http://localhost:4000/api/eb1a/assess",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(assessmentData),
                }
            );

            if (!response.ok) {
                throw new Error("Assessment failed");
            }

            const result = await response.json();

            // Update application status to mark eligibility as completed
            if (token) {
                try {
                    await fetch("http://localhost:4000/api/status/step", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            step: "eligibility",
                            completed: true,
                        }),
                    });
                } catch (statusError) {
                    console.error("Status update error:", statusError);
                    // Don't fail the whole process if status update fails
                }
            }

            // Navigate to results with AI assessment data
            navigate("/result", {
                state: {
                    formData,
                    aiAssessment: result.assessment,
                    assessmentId: result.assessment.assessmentId,
                },
            });
        } catch (error) {
            console.error("Assessment error:", error);
            // Fallback to mock result if API fails
            navigate("/result", { state: { formData } });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className={`input-field ${validationErrors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={formData.user?.name || ""}
                                onChange={(e) =>
                                    handleUserInputChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your full name"
                            />
                            <ErrorMessage message={validationErrors.name} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className={`input-field ${validationErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={formData.user?.email || ""}
                                onChange={(e) =>
                                    handleUserInputChange(
                                        "email",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email address"
                            />
                            <ErrorMessage message={validationErrors.email} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country of Origin
                            </label>
                            <input
                                type="text"
                                className={`input-field ${validationErrors.country ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={formData.user?.country || ""}
                                onChange={(e) =>
                                    handleUserInputChange(
                                        "country",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your country of origin"
                            />
                            <ErrorMessage message={validationErrors.country} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age
                            </label>
                            <input
                                type="number"
                                className={`input-field ${validationErrors.age ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={formData.user?.age || ""}
                                onChange={(e) =>
                                    handleUserInputChange(
                                        "age",
                                        parseInt(e.target.value)
                                    )
                                }
                                placeholder="Enter your age"
                                min="18"
                                max="100"
                            />
                            <ErrorMessage message={validationErrors.age} />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Highest Education Level
                            </label>
                            <select
                                className={`input-field ${validationErrors.educationLevel ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={formData.user?.educationLevel || ""}
                                onChange={(e) =>
                                    handleUserInputChange(
                                        "educationLevel",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">Select education level</option>
                                <option value="high-school">High School</option>
                                <option value="bachelors">
                                    Bachelor's Degree
                                </option>
                                <option value="masters">Master's Degree</option>
                                <option value="phd">PhD</option>
                                <option value="other">Other</option>
                            </select>
                            <ErrorMessage
                                message={validationErrors.educationLevel}
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total Funding Raised (USD)
                            </label>
                            <select
                                className={`input-field ${validationErrors.funding ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={
                                    formData.startupAchievements?.funding || ""
                                }
                                onChange={(e) =>
                                    handleInputChange("startupAchievements", {
                                        ...formData.startupAchievements,
                                        funding: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select funding range</option>
                                <option value="0-50k">$0 - $50K</option>
                                <option value="50k-500k">$50K - $500K</option>
                                <option value="500k-5m">$500K - $5M</option>
                                <option value="5m-50m">$5M - $50M</option>
                                <option value="50m+">$50M+</option>
                            </select>
                            <ErrorMessage message={validationErrors.funding} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Traction
                            </label>
                            <select
                                className={`input-field ${validationErrors.traction ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                                value={
                                    formData.startupAchievements?.traction || ""
                                }
                                onChange={(e) =>
                                    handleInputChange("startupAchievements", {
                                        ...formData.startupAchievements,
                                        traction: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select traction level</option>
                                <option value="idea-stage">Idea Stage</option>
                                <option value="mvp">MVP Built</option>
                                <option value="early-users">Early Users</option>
                                <option value="growing">
                                    Growing User Base
                                </option>
                                <option value="scaling">Scaling</option>
                                <option value="profitable">Profitable</option>
                            </select>
                            <ErrorMessage message={validationErrors.traction} />
                        </div>
                        <div>
                            <CommaSeparatedInput
                                value={
                                    formData.startupAchievements?.awards || []
                                }
                                onChange={(value) =>
                                    handleInputChange("startupAchievements", {
                                        ...formData.startupAchievements,
                                        awards: value,
                                    })
                                }
                                placeholder="e.g., YC W24, Forbes 30 Under 30, TechCrunch Disrupt Winner"
                                label="Awards & Recognition"
                            />
                        </div>
                        <div>
                            <CommaSeparatedInput
                                value={
                                    formData.startupAchievements?.patents || []
                                }
                                onChange={(value) =>
                                    handleInputChange("startupAchievements", {
                                        ...formData.startupAchievements,
                                        patents: value,
                                    })
                                }
                                placeholder="e.g., US Patent 1234567, International Patent 7654321"
                                label="Patents"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <CommaSeparatedInput
                            value={formData.media || []}
                            onChange={(value) =>
                                handleInputChange("media", value)
                            }
                            placeholder="e.g., TechCrunch, Forbes, The New York Times, Bloomberg"
                            label="Media Coverage & Press"
                        />
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <CommaSeparatedInput
                            value={formData.speakingExperience || []}
                            onChange={(value) =>
                                handleInputChange("speakingExperience", value)
                            }
                            placeholder="e.g., TEDx, SXSW, Web Summit, TechCrunch Disrupt"
                            label="Speaking Experience"
                        />
                        <CommaSeparatedInput
                            value={formData.publications || []}
                            onChange={(value) =>
                                handleInputChange("publications", value)
                            }
                            placeholder="e.g., Nature, Science, IEEE, ACM"
                            label="Publications & Papers"
                        />
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <CommaSeparatedInput
                            value={formData.references || []}
                            onChange={(value) =>
                                handleInputChange("references", value)
                            }
                            placeholder="e.g., John Doe (CEO at TechCorp), Jane Smith (Professor at Stanford)"
                            label="Potential References"
                        />
                        <CommaSeparatedInput
                            value={formData.usContacts || []}
                            onChange={(value) =>
                                handleInputChange("usContacts", value)
                            }
                            placeholder="e.g., Immigration lawyer, US employer, US university"
                            label="Existing US Contacts (optional)"
                        />
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume/CV
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="resume-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="resume-upload"
                                                name="resume-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "documents",
                                                        {
                                                            ...formData.documents!,
                                                            resume:
                                                                e.target
                                                                    .files?.[0] ||
                                                                null,
                                                        }
                                                    )
                                                }
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, or DOCX up to 10MB
                                    </p>
                                    {formData.documents?.resume && (
                                        <p className="text-sm text-green-600 font-medium">
                                            ✓ {formData.documents.resume.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents (Optional)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="supporting-docs-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                        >
                                            <span>Upload files</span>
                                            <input
                                                id="supporting-docs-upload"
                                                name="supporting-docs-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                multiple
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "documents",
                                                        {
                                                            ...formData.documents!,
                                                            supportingDocuments:
                                                                Array.from(
                                                                    e.target
                                                                        .files ||
                                                                        []
                                                                ),
                                                        }
                                                    )
                                                }
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX, JPG, PNG up to 10MB each
                                    </p>
                                    {formData.documents?.supportingDocuments &&
                                        formData.documents.supportingDocuments
                                            .length > 0 && (
                                            <div className="text-sm text-green-600 font-medium">
                                                ✓{" "}
                                                {
                                                    formData.documents
                                                        .supportingDocuments
                                                        .length
                                                }{" "}
                                                file(s) selected
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formData.documents.supportingDocuments.map(
                                                        (file, index) => (
                                                            <div key={index}>
                                                                {file.name}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Examples: Awards certificates, media articles,
                                patents, publications, reference letters
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={embedded ? "" : "min-h-screen bg-gray-50 py-8"}>
            <div className={embedded ? "" : "max-w-2xl mx-auto px-6"}>
                {/* Header - Only show if not embedded */}
                {!embedded && (
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Am I qualified?
                        </h1>
                        <p className="text-gray-600">
                            Let's assess your eligibility for EB-1A or O-1 visas
                        </p>
                    </div>
                )}

                {/* Progress Steps - Only show if not embedded */}
                {!embedded && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const stepCompleted =
                                    step.id < currentStep ||
                                    (step.id === currentStep &&
                                        isStepValid(step.id));
                                const stepCurrent = step.id === currentStep;
                                const stepInvalid =
                                    step.id === currentStep &&
                                    !isStepValid(step.id) &&
                                    Object.keys(validationErrors).length > 0;

                                return (
                                    <div
                                        key={step.id}
                                        className="flex items-center"
                                    >
                                        <div
                                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                                stepCompleted
                                                    ? "bg-primary-600 text-white"
                                                    : stepInvalid
                                                      ? "bg-red-100 text-red-600 border-2 border-red-300"
                                                      : stepCurrent
                                                        ? "bg-primary-100 text-primary-600 border-2 border-primary-300"
                                                        : "bg-gray-200 text-gray-400"
                                            }`}
                                        >
                                            {stepCompleted &&
                                            step.id < currentStep ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : stepInvalid ? (
                                                <AlertCircle className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    {step.id}
                                                </span>
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`w-16 h-0.5 mx-2 ${
                                                    step.id < currentStep
                                                        ? "bg-primary-600"
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600">
                                Step {currentStep} of {totalSteps}:{" "}
                                {steps[currentStep - 1].title}
                            </span>
                            {Object.keys(validationErrors).length > 0 && (
                                <div className="mt-2 text-sm text-red-600">
                                    Please complete all required fields to
                                    continue
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <div className={embedded ? "" : "card"}>
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center px-6 py-3 rounded-lg border ${
                            currentStep === 1
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={isSubmitting || !canProceedToNext()}
                        className={`btn-primary flex items-center ${
                            isSubmitting || !canProceedToNext()
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Assessing...
                            </>
                        ) : (
                            <>
                                {currentStep === totalSteps
                                    ? "Submit & Check Eligibility"
                                    : "Next"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EligibilityForm;
