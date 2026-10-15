"use client";

import { useEffect, useMemo, useState } from "react";
import {
  filterBusinesses,
  type Business,
  type BusinessCategory,
} from "../establishments";
import {
  demoStorageKeys,
  isDemoAppointment,
  readDemoList,
  writeDemoList,
  type DemoAppointment,
} from "../demo-storage";
import {
  createApiBusinessDirectory,
  getBookingDays,
  type EstablishmentResponse,
  type Appointment,
  type BookingDay,
  type BookingService,
  type SortOrder,
} from "./search-utils";
import { api } from "../lib/api";

export function useSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("Todos");
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [bookingDays, setBookingDays] = useState<BookingDay[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingService, setBookingService] = useState<BookingService | null>(
    null,
  );
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [savedAppointments, setSavedAppointments] = useState<
    DemoAppointment[]
  >([]);

  const [searchBusinesses, setSearchBusinesses] = useState<Business[]>([]);
  const [directoryError, setDirectoryError] = useState("");
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setSavedAppointments(
          readDemoList(demoStorageKeys.appointments, [], isDemoAppointment),
        );
      } catch (error) {
        setBookingError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os horários salvos neste navegador.",
        );
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDirectory() {
      try {
        const response = await api.get<EstablishmentResponse[]>(
          "/establishment",
        );

        if (!Array.isArray(response.data)) {
          throw new Error("A resposta da API de estabelecimentos é inválida.");
        }

        if (isMounted) {
          setSearchBusinesses(createApiBusinessDirectory(response.data));
          setDirectoryError("");
        }
      } catch (error) {
        if (isMounted) {
          setDirectoryError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os estabelecimentos.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingDirectory(false);
        }
      }
    }

    void loadDirectory();

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    const filtered = filterBusinesses(
      searchTerm,
      location,
      category,
      searchBusinesses,
    );

    if (sortOrder === "rating") {
      return [...filtered].sort(
        (first, second) => second.numericRating - first.numericRating,
      );
    }

    return filtered;
  }, [category, location, searchBusinesses, searchTerm, sortOrder]);

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    Boolean(location.trim()) ||
    category !== "Todos";

  function startBooking(businessInitials: string, serviceName: string) {
    if (bookingDays.length === 0) {
      const availableDays = getBookingDays();
      setBookingDays(availableDays);
      setSelectedDate(availableDays[0]?.value ?? "");
    }

    setBookingService({ businessInitials, serviceName });
    setSelectedTime(null);
    setAppointment(null);
  }

  function selectBookingDate(date: string) {
    setSelectedDate(date);
    setSelectedTime(null);
  }

  function selectBookingService(
    businessInitials: string,
    serviceName: string,
  ) {
    setBookingService({ businessInitials, serviceName });
    setAppointment(null);
  }

  function startAnotherAppointment() {
    setAppointment(null);
    setSelectedTime(null);
  }

  function clearFilters() {
    setSearchTerm("");
    setLocation("");
    setCategory("Todos");
    setSortOrder("relevance");
    setSelectedTime(null);
    setBookingService(null);
    setAppointment(null);
  }

  function saveAppointment(
    business: Business,
    serviceName: string,
    customerName: string,
    contact: string,
  ) {
    if (!selectedTime) {
      return;
    }

    const nextAppointment: Appointment = {
      id: globalThis.crypto.randomUUID(),
      businessInitials: business.initials,
      businessName: business.name,
      serviceName,
      date: selectedDate,
      time: selectedTime,
      customerName,
      contact,
      status: "scheduled",
    };

    try {
      const appointments = readDemoList(
        demoStorageKeys.appointments,
        [],
        isDemoAppointment,
      );
      const slotAlreadyBooked = appointments.some(
        (savedAppointment) =>
          savedAppointment.businessInitials === business.initials &&
          savedAppointment.date === selectedDate &&
          savedAppointment.time === selectedTime &&
          savedAppointment.status !== "cancelled",
      );

      if (slotAlreadyBooked) {
        setSavedAppointments(appointments);
        setSelectedTime(null);
        setBookingError(
          "Esse horário acabou de ser reservado. Escolha outro.",
        );
        return;
      }

      const nextAppointments = [...appointments, nextAppointment];
      writeDemoList(demoStorageKeys.appointments, nextAppointments);
      setSavedAppointments(nextAppointments);
      setBookingError("");
      setAppointment(nextAppointment);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o agendamento neste navegador.",
      );
    }
  }

  return {
    appointment,
    bookingDays,
    bookingError,
    bookingService,
    category,
    clearFilters,
    directoryError,
    hasFilters,
    isLoadingDirectory,
    location,
    results,
    savedAppointments,
    searchBusinesses,
    searchTerm,
    selectedDate,
    selectedTime,
    setCategory,
    setLocation,
    setSearchTerm,
    setSelectedTime,
    setSortOrder,
    sortOrder,
    startBooking,
    selectBookingDate,
    selectBookingService,
    startAnotherAppointment,
    saveAppointment,
  };
}
