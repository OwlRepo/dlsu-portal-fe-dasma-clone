import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

export default function EmployeeForm() {
  return (
    <form className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="Enter full name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Enter full name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter full name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Devices</Label>
        <Select>
          <SelectTrigger id="department">
            <SelectValue placeholder="Select Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Device</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-right !mt-8">
        <Button className="" type="submit">Create</Button>
      </div>
    </form>
  );
}
