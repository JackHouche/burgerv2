"use client";

import { useState, useEffect } from "react";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock } from "lucide-react";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface DaySlots {
  date: string;
  slots: TimeSlot[];
}

interface TimeSlotPickerProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSlotSelect: (date: string, time: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSlotSelect,
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DaySlots | null>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      if (response.ok) {
        const data = (await response.json()) as DaySlots[];
        setAvailableSlots(data);

        // Sélectionner automatiquement le premier jour avec des créneaux disponibles
        const firstAvailableDay = data.find(
          (day: DaySlots) => day.slots.length > 0,
        );
        if (firstAvailableDay && !selectedDay) {
          setSelectedDay(firstAvailableDay);
        }
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleDateSelect = (day: DaySlots) => {
    setSelectedDay(day);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDay) {
      onSlotSelect(selectedDay.date, time);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Choisir un créneau
      </h3>

      {/* Sélection du jour */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Jour</h4>
        <div className="grid grid-cols-1 gap-2">
          {availableSlots.map((day) => (
            <button
              key={day.date}
              onClick={() => handleDateSelect(day)}
              disabled={day.slots.length === 0}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedDay?.date === day.date
                  ? "border-orange-600 bg-orange-50 text-orange-600"
                  : day.slots.length === 0
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300 text-gray-900"
              }`}
            >
              <div className="font-medium">{formatDate(day.date)}</div>
              <div className="text-sm text-gray-500">
                {day.slots.length > 0
                  ? `${day.slots.length} créneaux disponibles`
                  : "Aucun créneau disponible"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de l'heure */}
      {selectedDay && selectedDay.slots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Heure
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={!slot.isAvailable}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  selectedDate === selectedDay.date &&
                  selectedTime === slot.time
                    ? "border-orange-600 bg-orange-600 text-white"
                    : slot.isAvailable
                      ? "border-gray-200 hover:border-orange-300 text-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                {formatTime(slot.time)}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableSlots.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Aucun créneau disponible pour le moment</p>
        </div>
      )}
    </div>
  );
}
