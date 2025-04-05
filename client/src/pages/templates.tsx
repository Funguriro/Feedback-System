import { TemplateList } from "@/components/templates/template-list";

export default function Templates() {
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
          <p className="text-gray-600">Manage your feedback request templates</p>
        </div>
      </div>

      <TemplateList />
    </div>
  );
}
