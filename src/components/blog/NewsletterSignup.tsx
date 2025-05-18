
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsletterSignup() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8">
            Get the latest AI insights and updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button className="bg-gradient-to-r from-journey-purple to-journey-blue text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
