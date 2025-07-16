import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { Page, PageFormData } from "@/types/page";
import { PageForm } from "./PageForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PagesTableProps {
  pages: Page[];
  onUpdate: (id: string, data: Partial<Page>) => Promise<void>;
  onCreate: (data: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const PagesTable = ({ pages, onUpdate, onCreate, onDelete, isLoading }: PagesTableProps) => {
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = async (data: PageFormData) => {
    if (!editingPage) return;
    
    setActionLoading(true);
    try {
      await onUpdate(editingPage.id, data);
      setEditingPage(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = async (data: PageFormData) => {
    setActionLoading(true);
    try {
      await onCreate(data);
      setShowCreateForm(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await onDelete(id);
    } finally {
      setActionLoading(false);
    }
  };

  const formatPriority = (priority: number) => {
    const variants = {
      1.0: "default",
      0.9: "secondary", 
      0.8: "secondary",
      0.7: "outline",
      0.6: "outline",
      0.5: "outline",
      0.3: "outline"
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pages Management</h3>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <PageForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={actionLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Change Freq</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {page.path}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://www.journ3y.com.au${page.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{formatPriority(page.priority)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{page.change_frequency}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={page.is_published ? "default" : "secondary"}>
                    {page.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={editingPage?.id === page.id} onOpenChange={(open) => !open && setEditingPage(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPage(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Page</DialogTitle>
                        </DialogHeader>
                        <PageForm
                          page={editingPage || undefined}
                          onSubmit={handleEdit}
                          onCancel={() => setEditingPage(null)}
                          isLoading={actionLoading}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{page.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            disabled={actionLoading}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};