import type { FormEvent } from "react";
import type { Business } from "../establishments";
import { ArrowIcon } from "./search-icons";
import {
  appointmentTimes,
  formatAppointmentDate,
  type Appointment,
  type BookingDay,
  type BookingService,
} from "./search-utils";

type BookingPanelProps = {
  business: Business;
  bookingService: BookingService;
  bookingDays: BookingDay[];
  selectedDate: string;
  selectedTime: string | null;
  appointment: Appointment | null;
  savedAppointments: Appointment[];
  bookingError: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string | null) => void;
  onSelectService: (serviceName: string) => void;
  onStartAnother: () => void;
  onSave: (customerName: string, contact: string) => void;
};

export default function BookingPanel({
  business,
  bookingService,
  bookingDays,
  selectedDate,
  selectedTime,
  appointment,
  savedAppointments,
  bookingError,
  onSelectDate,
  onSelectTime,
  onSelectService,
  onStartAnother,
  onSave,
}: BookingPanelProps) {
  const bookingAppointment =
    appointment?.businessInitials === business.initials ? appointment : null;

  return (
    <section
      className="booking-panel"
      aria-labelledby={`booking-title-${business.initials}`}
    >
      {bookingAppointment ? (
        <BookingConfirmation
          appointment={bookingAppointment}
          business={business}
          onStartAnother={onStartAnother}
        />
      ) : (
        <BookingForm
          business={business}
          bookingService={bookingService}
          bookingDays={bookingDays}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          savedAppointments={savedAppointments}
          bookingError={bookingError}
          onSelectDate={onSelectDate}
          onSelectTime={onSelectTime}
          onSelectService={onSelectService}
          onSave={onSave}
        />
      )}
    </section>
  );
}

type BookingConfirmationProps = {
  appointment: Appointment;
  business: Business;
  onStartAnother: () => void;
};

function BookingConfirmation({
  appointment,
  business,
  onStartAnother,
}: BookingConfirmationProps) {
  return (
    <div className="booking-confirmation" role="status">
      <span className="booking-confirmation-icon" aria-hidden="true">
        ✓
      </span>
      <span className="booking-step-label">AGENDAMENTO DE DEMONSTRAÇÃO</span>
      <h4>Horário reservado, {appointment.customerName.split(" ")[0]}!</h4>
      <p>
        {appointment.serviceName} · {formatAppointmentDate(appointment.date)} às{" "}
        {appointment.time}
      </p>
      <p>
        {business.name} · {business.detail}
      </p>
      <p>Contato informado: {appointment.contact}</p>
      <button
        className="booking-secondary-action"
        onClick={onStartAnother}
        type="button"
      >
        Fazer outro agendamento
      </button>
      <small>
        Esta é uma confirmação demonstrativa. Nenhum horário real foi reservado.
      </small>
    </div>
  );
}

type BookingFormProps = Omit<BookingPanelProps, "appointment" | "onStartAnother">;

function BookingForm({
  business,
  bookingService,
  bookingDays,
  selectedDate,
  selectedTime,
  savedAppointments,
  bookingError,
  onSelectDate,
  onSelectTime,
  onSelectService,
  onSave,
}: BookingFormProps) {
  const chosenService = business.services.find(
    (service) => service.name === bookingService.serviceName,
  );
  const selectedDayIndex = Math.max(
    0,
    bookingDays.findIndex((day) => day.value === selectedDate),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSave(
      String(formData.get("customerName")),
      String(formData.get("contact")),
    );
  }

  return (
    <>
      <div className="booking-panel-heading">
        <span className="booking-step-label">PRÓXIMO PASSO</span>
        <h4 id={`booking-title-${business.initials}`}>Escolha um horário</h4>
        <p>
          {bookingService.serviceName} · {chosenService?.duration} ·{" "}
          {chosenService?.price}
        </p>
      </div>
      <div className="booking-days" aria-label="Escolher data">
        {bookingDays.map((day) => (
          <button
            aria-pressed={selectedDate === day.value}
            className={`booking-day${selectedDate === day.value ? " selected" : ""}`}
            key={day.value}
            onClick={() => onSelectDate(day.value)}
            type="button"
          >
            <span>{day.weekday}</span>
            <strong>{day.day}</strong>
            <span>{day.month}</span>
          </button>
        ))}
      </div>
      <span className="booking-field-label">Horários disponíveis</span>
      <div className="booking-times" aria-label="Horários disponíveis">
        {appointmentTimes.map((time, index) => {
          const unavailable = (index + selectedDayIndex) % 5 === 0;
          const alreadyBooked = savedAppointments.some(
            (savedAppointment) =>
              savedAppointment.businessInitials === business.initials &&
              savedAppointment.date === selectedDate &&
              savedAppointment.time === time &&
              savedAppointment.status !== "cancelled",
          );

          return (
            <button
              aria-pressed={selectedTime === time}
              className={`booking-time${selectedTime === time ? " selected" : ""}`}
              disabled={unavailable || alreadyBooked || !selectedDate}
              key={time}
              onClick={() => onSelectTime(time)}
              type="button"
            >
              {time}
              {unavailable && (
                <span className="visually-hidden"> — indisponível</span>
              )}
            </button>
          );
        })}
      </div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label className="booking-form-service">
          <span>Serviço</span>
          <select
            name="service"
            onChange={(event) => onSelectService(event.target.value)}
            value={bookingService.serviceName}
            required
          >
            {business.services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name} · {service.duration} · {service.price}
              </option>
            ))}
          </select>
        </label>
        <div className="booking-form-fields">
          <label>
            <span>Seu nome</span>
            <input
              autoComplete="name"
              name="customerName"
              placeholder="Nome completo"
              required
            />
          </label>
          <label>
            <span>E-mail ou telefone</span>
            <input
              name="contact"
              placeholder="Como podemos confirmar?"
              required
            />
          </label>
        </div>
        <button
          className="booking-submit"
          disabled={!selectedTime || !selectedDate}
          type="submit"
        >
          Confirmar agendamento
          <ArrowIcon />
        </button>
      </form>
      {bookingError && (
        <p className="booking-storage-error" role="alert">
          {bookingError}
        </p>
      )}
      <p className="booking-demo-note">
        Demonstração: o agendamento fica salvo neste navegador e pode ser
        consultado na gestão. A disponibilidade não é consultada em tempo real.
      </p>
    </>
  );
}
