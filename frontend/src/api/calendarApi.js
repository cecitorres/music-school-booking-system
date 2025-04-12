// src/api/calendarApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5297/api',
});

export default {
  /**
   * Fetch available slots for a specific teacher.
   * @param {string} teacherId - The ID of the teacher.
   * @returns {Promise} - A promise that resolves to the available slots.
   */
  getAvailableSlots: (teacherId) => api.get(`/teachers/${teacherId}/calendars`),

  /**
   * Add a new available slot for a specific teacher.
   * @param {string} teacherId - The ID of the teacher.
   * @param {object} slotData - The slot data to add (e.g., startTime, endTime).
   * @returns {Promise} - A promise that resolves to the added slot.
   */
  addSlot: (teacherId, slotData) =>
    api.post(`/teachers/${teacherId}/calendars`, slotData),

  /**
   * Delete an available slot for a specific teacher.
   * @param {string} teacherId - The ID of the teacher.
   * @param {string} slotId - The ID of the slot to delete.
   * @returns {Promise} - A promise that resolves to the deleted slot.
   */
  deleteSlot: (teacherId, slotId) =>
    api.delete(`/teachers/${teacherId}/calendars/${slotId}`),

  /**
   * Update an existing slot for a specific teacher.
   * @param {string} teacherId - The ID of the teacher.
   * @param {string} slotId - The ID of the slot to update.
   * @param {object} slotData - The updated slot data.
   * @returns {Promise} - A promise that resolves to the updated slot.
   */
  updateSlot: (teacherId, slotId, slotData) =>
    api.put(`/teachers/${teacherId}/calendars/${slotId}`, slotData),
};
