import {
  getEventFromLocalStorage,
  saveNCEventTitle,
  saveNCEventDueDate,
  deleteNCEvent,
  DEFAULT_NC_EVENT,
  NCEvent,
} from './storage';

const NC_EVENT_KEY = 'nc_event';

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getEventFromLocalStorage', () => {
    it('should return default event if localStorage is empty', () => {
      const event = getEventFromLocalStorage();
      expect(event).toEqual(DEFAULT_NC_EVENT);
    });

    it('should return parsed event from localStorage', () => {
      const mockEvent: NCEvent = { title: 'Test Event', dueDate: new Date() };
      localStorage.setItem(NC_EVENT_KEY, JSON.stringify(mockEvent));

      const event = getEventFromLocalStorage();
      expect(event.title).toEqual(mockEvent.title);
      expect(event.dueDate?.toISOString()).toEqual(mockEvent.dueDate?.toISOString());
    });

    it('should return default event if JSON.parse fails', () => {
      localStorage.setItem(NC_EVENT_KEY, 'invalid JSON');
      const event = getEventFromLocalStorage();
      expect(event).toEqual(DEFAULT_NC_EVENT);
    });
  });

  describe('saveNCEventTitle', () => {
    it('should save title to localStorage', () => {
      saveNCEventTitle('New Title');

      const eventStr = localStorage.getItem(NC_EVENT_KEY);
      const event = JSON.parse(eventStr as string);
      expect(event.title).toBe('New Title');
    });

    it('should update title in existing event', () => {
      const mockEvent: NCEvent = { title: 'Old Title', dueDate: new Date() };
      localStorage.setItem(NC_EVENT_KEY, JSON.stringify(mockEvent));

      saveNCEventTitle('New Title');

      const eventStr = localStorage.getItem(NC_EVENT_KEY);
      const event = JSON.parse(eventStr as string);
      expect(event.title).toBe('New Title');
      expect(new Date(event.dueDate)).toEqual(mockEvent.dueDate!);
    });
  });

  describe('saveNCEventDueDate', () => {
    it('should save due date to localStorage', () => {
      const newDate = new Date();
      saveNCEventDueDate(newDate);

      const eventStr = localStorage.getItem(NC_EVENT_KEY);
      const event = JSON.parse(eventStr as string);
      expect(new Date(event.dueDate)).toEqual(newDate);
    });

    it('should update due date in existing event', () => {
      const mockEvent: NCEvent = { title: 'Test Event', dueDate: new Date('2024-01-01') };
      localStorage.setItem(NC_EVENT_KEY, JSON.stringify(mockEvent));

      const newDate = new Date('2024-12-31');
      saveNCEventDueDate(newDate);

      const eventStr = localStorage.getItem(NC_EVENT_KEY);
      const event = JSON.parse(eventStr as string);
      expect(event.title).toBe(mockEvent.title);
      expect(new Date(event.dueDate)).toEqual(newDate);
    });
  });

  describe('deleteNCEvent', () => {
    it('should remove event from localStorage', () => {
      const mockEvent: NCEvent = { title: 'Test Event', dueDate: new Date() };
      localStorage.setItem(NC_EVENT_KEY, JSON.stringify(mockEvent));

      deleteNCEvent();

      const eventStr = localStorage.getItem(NC_EVENT_KEY);
      expect(eventStr).toBeNull();
    });
  });
});
