'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { UserHeader } from './UserManagementPageContainer';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

interface EditDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserHeader | null;
  refetchUserList: () => void;
  // onSave: (updatedUser: UserHeader) => void;
}

const EditDetailsDialog: React.FC<EditDetailsDialogProps> = ({
  isOpen,
  onClose,
  user,
  refetchUserList,
  // onSave,
}) => {
  const { toast } = useToast();

  const [role, setRole] = useState(user?.ROLE || '');
  const [firstName, setFirstName] = useState(user?.FIRST_NAME || '');
  const [lastName, setLastName] = useState(user?.LAST_NAME || '');
  const [email, setEmail] = useState(user?.EMAIL || '');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user) {
        const userData = Cookies.get('user');
        const token = userData ? JSON.parse(userData).token : null;

        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/${role}/${user.EMPLOYEE_ID}`,
          {
            first_name: firstName,
            last_name: lastName,
            email
          },
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (res.data) {
          toast({
            title: 'Success',
            description: 'User details updated successfully',
            duration: 3000,
          });
          refetchUserList();
          onClose();
        } else {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred',
            variant: 'destructive',
            duration: 3000,
          });
        }
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: `An unexpected error occurred, ${e}`,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.FIRST_NAME);
      setLastName(user.LAST_NAME);
      setEmail(user.EMAIL || '');
      setRole(user.ROLE);
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>Edit the details of the user</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* <div>
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
              />
            </div> */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                First Name
              </p>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Name
              </p>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            {/* <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <DialogFooter>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDetailsDialog;
