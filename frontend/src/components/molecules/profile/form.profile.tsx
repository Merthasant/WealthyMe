"use client";

import DatePicker from "@/components/molecules/date-picker.molecule";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import professionsMock from "@/lib/mock/professions.mock";
import timezonesMock from "@/lib/mock/timezones.mock";
import { VenetianMask } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import CropperImage from "../cropper-image.molecule";
import {
  createInputProfileSchema,
  type CreateInputProfile,
} from "@/lib/types/profile.type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultTimezone } from "@/lib/utils/date.utils";
import { type z } from "zod";
import { Label } from "@/components/ui/label";
import defaultAvatar from "@/assets/default-avatar.webp";
import { navigateTo } from "@/lib/utils/navigate.utils";
import { createProfile } from "@/lib/APIs/services/profile.service";
import { useMutation } from "@tanstack/react-query";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function FormProfile() {
  // avatar
  const [rawAvatar, setRawAvatar] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // timezone
  const [timezoneOpen, setTimezoneOpen] = useState<boolean>(false);
  const selectedTimezoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timezoneOpen) {
      setTimeout(() => {
        selectedTimezoneRef.current?.scrollIntoView({ block: "center" });
      }, 50);
    }
  }, [timezoneOpen]);

  const form = useForm<
    z.input<typeof createInputProfileSchema>,
    unknown,
    z.output<typeof createInputProfileSchema>
  >({
    resolver: zodResolver(createInputProfileSchema),
    defaultValues: {
      displayName: undefined,
      birthDate: undefined,
      profession: undefined,
      avatar: undefined,
      timezone: getDefaultTimezone(),
    },
  });

  const mutate = useMutation({
    mutationFn: (data: CreateInputProfile) => createProfile(data),
    onSuccess: (data) => {
      console.log("Profile created successfully", data);
      navigateTo("/dashboard");
    },
  });

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setRawAvatar(file);
    setCropperOpen(true);
  };

  const onCropDone = (croppedFile: File) => {
    if (!croppedFile) return;
    setAvatarPreview(URL.createObjectURL(croppedFile));
    form.setValue("avatar", croppedFile, { shouldDirty: true });
    setCropperOpen(false);
  };

  const [isDetailedProfession, setIsDetailedProfession] =
    useState<boolean>(false);

  const onSubmit = async (data: CreateInputProfile) => {
    console.log("Form Data Submitted:", data);
    await mutate.mutateAsync(data);
    navigateTo("/dashboard");
  };

  const onCancel = async () => {
    await mutate.mutateAsync({ timezone: getDefaultTimezone() });
    navigateTo("/dashboard");
  };

  return (
    <div className="min-w-sm px-4 py-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>
            <FieldTitle>
              <h1 className="text-2xl text-primary font-bold">
                Create Profile
              </h1>
            </FieldTitle>
            <FieldDescription>
              Create your profile to get started with our services
            </FieldDescription>
          </FieldLegend>
          <FieldGroup>
            {/* avatar image */}

            <Label
              htmlFor="avatar"
              className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center shadow justify-center mx-auto mt-4 cursor-pointer hover:brightness-95 transition-colors"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : (
                <img src={defaultAvatar} alt="Default Avatar" />
              )}
            </Label>

            {/* avatar */}
            <Controller
              control={form.control}
              name="avatar"
              render={({ field: { ref }, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                  <Input
                    id="avatar"
                    type="file"
                    ref={ref}
                    accept="image/*"
                    name="avatar" // biar bisa ditangkap oleh multer
                    onChange={onAvatarChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    You can upload your avatar later if you want, just leave it
                  </FieldDescription>
                </Field>
              )}
            />

            {/* display name */}
            <Controller
              control={form.control}
              name="displayName"
              render={({ field: { value, ...fields }, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="display-name">Display Name</FieldLabel>
                  <Input
                    icon={<VenetianMask />}
                    id="display-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Display name here..."
                    value={value ?? ""}
                    {...fields}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* date of birth */}
            <Controller
              control={form.control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <Field>
                  <DatePicker
                    label="Birth Date"
                    onChange={onChange}
                    value={value}
                  />
                </Field>
              )}
            />

            {/* profession */}
            <Controller
              control={form.control}
              name="profession"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profession">Profession</FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="profession" className="w-full">
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {isDetailedProfession
                        ? professionsMock.details.map((group, groupIndex) => (
                            <SelectGroup key={groupIndex}>
                              <SelectLabel>{group.profession}</SelectLabel>
                              {group.list.map((profession, professionIndex) => (
                                <SelectItem
                                  key={professionIndex}
                                  value={profession}
                                >
                                  {profession}
                                </SelectItem>
                              ))}
                              <SelectSeparator />
                            </SelectGroup>
                          ))
                        : professionsMock.simple.map((profession, index) => (
                            <SelectItem key={index} value={profession}>
                              {profession}
                            </SelectItem>
                          ))}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setIsDetailedProfession(!isDetailedProfession)
                        }
                      >
                        {isDetailedProfession ? "less..." : "more..."}
                      </Button>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* timezone */}
            <Controller
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <>
                  <Field className="grid grid-cols-2 gap-4">
                    <FieldLabel htmlFor="timezone" className="col-span-2">
                      Timezone
                    </FieldLabel>
                    <Button
                      variant={"ghost"}
                      type="button"
                      id="timezone"
                      onClick={() => setTimezoneOpen(true)}
                    >
                      Select Timezone
                    </Button>
                    <Input disabled value={field.value} />
                  </Field>
                  <CommandDialog
                    open={timezoneOpen}
                    onOpenChange={setTimezoneOpen}
                  >
                    <Command>
                      <CommandInput placeholder="Search timezone..." />
                      <CommandList>
                        {Object.entries(timezonesMock).map(
                          ([region, value]) => (
                            <CommandGroup key={region} heading={region}>
                              {value.map((item, index) => (
                                <CommandItem
                                  value={item.value}
                                  key={index}
                                  ref={
                                    item.value === field.value
                                      ? selectedTimezoneRef
                                      : undefined
                                  }
                                  onSelect={(v) => {
                                    field.onChange(v);
                                    setTimezoneOpen(false);
                                  }}
                                  className={cn(
                                    "grid grid-cols-5 px-4 leading-0",
                                    item.value === field.value
                                      ? "bg-accent text-accent-foreground"
                                      : "",
                                  )}
                                >
                                  <h1 className="col-span-3 font-bold">
                                    {item.label}
                                  </h1>
                                  <h1 className="col-span-1 text-end text-muted-foreground">
                                    {item.offset}
                                  </h1>
                                  <h1 className="col-span-1 rounded-full font-bold px-3 py-2 bg-muted w-fit text-muted-foreground ms-auto">
                                    {item.abbr}
                                  </h1>
                                  {item.cities && (
                                    <h1 className="col-span-5 divide-x-2 divide-transparent text-xs text-muted-foreground">
                                      {item.cities.map((cities, index) => (
                                        <span key={index + cities}>
                                          {cities}
                                        </span>
                                      ))}
                                    </h1>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ),
                        )}
                      </CommandList>
                    </Command>
                  </CommandDialog>
                </>
              )}
            />
            <Field>
              <Button variant={"outline"} onClick={onCancel}>
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting
                  ? "Creating Profile..."
                  : "Create Profile"}
              </Button>
            </Field>

            <CropperImage
              open={cropperOpen}
              onClose={() => setCropperOpen(false)}
              onCropDone={onCropDone}
              imageSrc={rawAvatar ? URL.createObjectURL(rawAvatar) : undefined}
              aspect={1}
            />
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
