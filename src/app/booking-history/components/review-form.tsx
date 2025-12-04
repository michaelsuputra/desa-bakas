'use client';

import { useState } from 'react';

import { Session } from 'next-auth';

import { guesthouse_transaction } from '@prisma/client';
import { Camera, ChevronDown, ChevronUp, MessageSquarePlus, Star } from 'lucide-react';
import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { Textarea } from '@/components/ui/textarea';

import { reviewGuestHouse } from '../lib/action';

export default function ReviewForm({
  session,
  booking,
}: {
  session: Session;
  booking: guesthouse_transaction;
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Ukuran file melebihi batas maksimum 1MB.');
        e.target.value = '';
        return;
      }
    }
  };

  async function clientActionReview(formData: FormData) {
    const result = await reviewGuestHouse(formData);

    if (result?.success) {
      toast.success('Your review has been submitted successfully.');
      // redirect('/');
    } else {
      console.log(result?.error);
      toast.error('Oops! Something went wrong during the process');
    }
  }

  return (
    <form action={clientActionReview}>
      <input
        type="hidden"
        name="user_id"
        value={session.user.db_user_id || ''}
      />

      <input
        type="hidden"
        name="guesthouse_id"
        value={booking.guesthouse_id || ''}
      />

      <input
        type="hidden"
        name="guesthouse_transaction_id"
        value={booking.guesthouse_transaction_id}
      />

      <Collapsible
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Add a Review?</h3>
              <p className="text-muted-foreground text-xs">Share your experience with us</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2">
              {isReviewOpen ? 'Cancel' : 'Write Review'}
              {isReviewOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-6 pt-2 pb-6">
          <div className="bg-muted/30 grid gap-6 rounded-lg border border-dashed p-6">
            {/* Rating Input */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How was your stay?</Label>
              <div className="flex items-center gap-4">
                <Rating
                  value={ratingValue}
                  onValueChange={setRatingValue}
                  className="gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      key={index}
                      size={28}
                      className="transition-transform hover:scale-110"
                      icon={
                        <Star
                          className={
                            index < ratingValue
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }
                        />
                      }
                    />
                  ))}
                </Rating>
                <span className="text-muted-foreground text-sm font-medium">
                  {ratingValue > 0 ? `${ratingValue} out of 5 stars` : 'Select stars'}
                </span>
                {/* Hidden Input for Backend Submission */}
                <input
                  type="hidden"
                  name="rating"
                  value={ratingValue}
                />
              </div>
            </div>

            {/* Impression Textarea */}
            <div className="space-y-3">
              <Label
                htmlFor="impression"
                className="text-base font-medium">
                Tell us more about your experience
              </Label>
              <Textarea
                id="impression"
                name="impression"
                placeholder="What did you like best? What could be improved?"
                className="min-h-[120px] resize-none bg-white"
              />
            </div>

            {/* Review Image Upload */}
            <div className="space-y-3">
              <Label
                htmlFor="review_image"
                className="text-base font-medium">
                Add Photos
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="review_image"
                  name="review_image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFile}
                />
                <Camera className="text-muted-foreground h-5 w-5" />
              </div>
            </div>

            <MyButton />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </form>
  );
}
