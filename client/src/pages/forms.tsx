import { FormBuilder } from "@/components/forms/form-builder";

export default function Forms() {
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feedback Forms</h1>
          <p className="text-gray-600">Create and manage your feedback collection forms</p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-sm text-gray-500">
            Customize how customers provide feedback through your forms
          </p>
        </div>
      </div>

      <FormBuilder />
    </div>
  );
}
