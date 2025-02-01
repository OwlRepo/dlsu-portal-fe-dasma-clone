'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import useUserToken from '@/hooks/useUserToken';

const accountFormSchema = z.object({
  employeeId: z.string(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  employeeId: '',
  username: '',
  first_name: '',
  last_name: '',
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const { toast } = useToast();
  const { token, userId } = useUserToken();

  const onSubmit = async (data: AccountFormValues) => {
    // TODO: Implement save functionality
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/${userId}`,
        {
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Account Info Updated',
          description:
            'Your account information has been updated successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description:
            'An error occurred while updating your account information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          'An error occurred while updating your account information.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Account Info</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Update your account information.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="employeeId"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="submit">
              Save Changes
            </Button>
            <Button
              variant="default"
              className="bg-[#00BC65] hover:bg-green-600"
              type="button"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
