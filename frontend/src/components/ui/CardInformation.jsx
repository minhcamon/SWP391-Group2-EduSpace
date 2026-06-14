import { Card, CardHeader, CardTitle, CardDescription } from "./Card";

const CardInformation = ({ title, description, children, ...props }) => {
    return (
        <Card className="p-6 border border-gray-200 shadow-sm bg-white" {...props}>
            <CardHeader className="p-0 gap-0.5">
                <CardTitle className="text-2xl font-bold tracking-tight text-neutral-dark">
                    {children ? children : title}
                </CardTitle>
                {description && (
                    <CardDescription className="text-gray-500 text-sm mt-0.5">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
        </Card>
    );
};

export default CardInformation;

