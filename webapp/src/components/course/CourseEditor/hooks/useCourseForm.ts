import { useState, useCallback, useEffect } from "react";
import { PaymentType } from "../PaymentOptions";
import { CourseSession, EditCourse } from "../types";
import { formatUserName } from "../../../../utils/format";
import { DateTime } from "luxon";
import { CourseDto } from "@easymotion/openapi";

const initialCourseState: EditCourse = {
  title: "",
  shortDescription: "",
  description: "",
  location: "",
  instructorName: "",
  categoryId: undefined,
  level: "BASIC",
  sessions: [],
  tags: [],
  isFree: true,
  price: null,
  numPayments: null,
  isPublished: false,
  subscriptionsOpen: false,
  maxSubscribers: null,
};

export interface UseCourseFormProps {
  open: boolean;
  courseId?: string;
  initialData?: CourseDto;
  user: any;
  categories: any[];
}

export const useCourseForm = ({
  open,
  courseId,
  initialData,
  user,
  categories,
}: UseCourseFormProps) => {
  const [editCourse, setEditCourse] = useState<EditCourse>({
    ...initialCourseState,
    instructorName: formatUserName(user),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (!open) {
      // Reset to initial state when modal is closed
      setEditCourse({
        ...initialCourseState,
        instructorName: formatUserName(user),
      });
      setErrors({});
    }
  }, [open, user]);

  // Load course data if editing
  useEffect(() => {
    if (open && courseId && initialData) {
      const course = initialData;
      setEditCourse({
        title: course.name,
        shortDescription: course.short_description,
        description: course.description,
        location: course.location,
        instructorName: course.instructors[0],
        categoryId: course.category.id,
        level: course.level,
        sessions: course.sessions.map((session) => ({
          id: session.id,
          startTime: DateTime.fromISO(session.start_time),
          endTime: DateTime.fromISO(session.end_time),
        })),
        tags: course.tags,
        isFree: course.is_free,
        price: course.price,
        numPayments: course.number_of_payments,
        isPublished: course.is_published,
        subscriptionsOpen: course.subscriptions_open,
        maxSubscribers: course.max_subscribers,
      });
    }
  }, [open, courseId, initialData]);

  // Set initial category for new courses
  useEffect(() => {
    if (
      open &&
      !courseId &&
      categories &&
      categories.length > 0 &&
      !editCourse.categoryId
    ) {
      setEditCourse((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [open, courseId, categories, editCourse.categoryId]);

  // Form handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setEditCourse((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const setTags = useCallback(
    (tags: string[]) => setEditCourse((prev) => ({ ...prev, tags })),
    []
  );

  const setSchedule = useCallback(
    (sessions: CourseSession[]) =>
      setEditCourse((prev) => ({
        ...prev,
        sessions,
      })),
    []
  );

  const setPaymentType = useCallback((paymentType: PaymentType) => {
    setEditCourse((prev) => {
      const isFree = paymentType === "free";
      const isMultiple = paymentType === "multiple";

      return {
        ...prev,
        isFree,
        price: isFree ? null : prev.price,
        numPayments: isMultiple ? prev.numPayments || 2 : null,
      };
    });
  }, []);

  const setPrice = useCallback(
    (price: number | null | undefined) =>
      setEditCourse((prev) => ({ ...prev, price })),
    []
  );

  const setNumPayments = useCallback(
    (numPayments: number | null | undefined) =>
      setEditCourse((prev) => ({ ...prev, numPayments })),
    []
  );

  const handleMaxSubscribersToggle = useCallback(
    (checked: boolean) =>
      setEditCourse((prev) => ({
        ...prev,
        maxSubscribers: checked ? 1 : null,
      })),
    []
  );

  const handleMaxSubscribersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === "" ? "" : parseInt(e.target.value);
      setEditCourse((prev) => ({
        ...prev,
        maxSubscribers: value === "" ? 0 : Math.max(0, value),
      }));
    },
    []
  );

  // Toggle publication status
  const setIsPublished = useCallback(
    (isPublished: boolean) =>
      setEditCourse((prev) => ({ ...prev, isPublished })),
    []
  );

  // Toggle subscriptions open status
  const setSubscriptionsOpen = useCallback(
    (subscriptionsOpen: boolean) =>
      setEditCourse((prev) => ({ ...prev, subscriptionsOpen })),
    []
  );

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!editCourse.title.trim()) newErrors.title = "Il titolo è obbligatorio";
    if (!editCourse.shortDescription.trim())
      newErrors.shortDescription = "La descrizione breve è obbligatoria";
    if (!editCourse.description.trim())
      newErrors.description = "La descrizione è obbligatoria";
    if (editCourse.sessions.length === 0)
      newErrors.schedule = "È necessario selezionare almeno una data";
    if (!editCourse.instructorName.trim())
      newErrors.instructorName = "Il nome dell'istruttore è obbligatorio";
    if (!editCourse.categoryId)
      newErrors.categoryId = "La categoria è obbligatoria";

    if (!editCourse.isFree) {
      if (!editCourse.price || editCourse.price <= 0) {
        newErrors.price = "Il prezzo deve essere maggiore di zero";
      }
      if (!!editCourse.numPayments && editCourse.numPayments < 2) {
        newErrors.numPayments = "Il numero di rate deve essere almeno 2";
      }
    }

    if (!!editCourse.maxSubscribers && editCourse.maxSubscribers < 1) {
      newErrors.maxSubscribers =
        "Il numero massimo di partecipanti deve essere almeno 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editCourse]);

  // Format the course data for submission
  const getCourseData = useCallback(() => {
    return {
      name: editCourse.title,
      short_description: editCourse.shortDescription,
      description: editCourse.description,
      location: editCourse.location,
      sessions: editCourse.sessions.map((x) => ({
        id: x.id,
        start_time: x.startTime.toISO() || "",
        end_time: x.endTime.toISO() || "",
      })),
      instructors: [editCourse.instructorName],
      category_id: editCourse.categoryId || "",
      level: editCourse.level,
      tags: editCourse.tags,
      price: editCourse.price,
      is_free: editCourse.isFree,
      number_of_payments: editCourse.numPayments,
      max_subscribers: editCourse.maxSubscribers,
      is_published: editCourse.isPublished,
      subscriptions_open: editCourse.subscriptionsOpen,
    };
  }, [editCourse]);

  // Check if form is valid (for submit button)
  const isFormValid = useCallback(() => {
    // Check all mandatory fields
    if (!editCourse.title.trim()) return false;
    if (!editCourse.shortDescription.trim()) return false;
    if (!editCourse.description.trim()) return false;
    if (!editCourse.instructorName.trim()) return false;
    if (!editCourse.categoryId) return false;
    if (editCourse.sessions.length === 0) return false;

    // Check payment fields
    if (!editCourse.isFree) {
      if (!editCourse.price || editCourse.price <= 0) return false;
      if (
        editCourse.numPayments !== null &&
        editCourse.numPayments !== undefined &&
        editCourse.numPayments < 2
      )
        return false;
    }

    return true;
  }, [editCourse]);

  // Generate tooltip message
  const getMissingFields = useCallback(() => {
    const missingFields = [];

    if (!editCourse.title.trim()) missingFields.push("Titolo");
    if (!editCourse.shortDescription.trim())
      missingFields.push("Descrizione breve");
    if (!editCourse.description.trim())
      missingFields.push("Descrizione completa");
    if (!editCourse.instructorName.trim())
      missingFields.push("Nome istruttore");
    if (!editCourse.categoryId) missingFields.push("Categoria");
    if (editCourse.sessions.length === 0)
      missingFields.push("Calendario (almeno una sessione)");

    if (!editCourse.isFree) {
      if (!editCourse.price || editCourse.price <= 0)
        missingFields.push("Prezzo valido");
      if (
        editCourse.numPayments !== null &&
        editCourse.numPayments !== undefined &&
        editCourse.numPayments < 2
      ) {
        missingFields.push("Numero di rate (minimo 2)");
      }
    }

    if (!!editCourse.maxSubscribers && editCourse.maxSubscribers < 1) {
      missingFields.push("Numero massimo di partecipanti valido");
    }

    return missingFields;
  }, [editCourse]);

  return {
    editCourse,
    errors,
    handleChange,
    setTags,
    setSchedule,
    setPaymentType,
    setPrice,
    setNumPayments,
    handleMaxSubscribersToggle,
    handleMaxSubscribersChange,
    setIsPublished,
    setSubscriptionsOpen,
    validateForm,
    getCourseData,
    isFormValid,
    getMissingFields,
  };
};
