package com.ssafy.kickcap.dashboard.dto;

public enum TimeIndex {
    MIDNIGHT_TO_3AM(0, "00:00:00", "02:59:59"),
    THREE_AM_TO_6AM(1, "03:00:00", "05:59:59"),
    SIX_AM_TO_9AM(2, "06:00:00", "08:59:59"),
    NINE_AM_TO_NOON(3, "09:00:00", "11:59:59"),
    NOON_TO_3PM(4, "12:00:00", "14:59:59"),
    THREE_PM_TO_6PM(5, "15:00:00", "17:59:59"),
    SIX_PM_TO_9PM(6, "18:00:00", "20:59:59"),
    NINE_PM_TO_MIDNIGHT(7, "21:00:00", "23:59:59");

    private final int index;
    private final String startTime;
    private final String endTime;

    TimeIndex(int index, String startTime, String endTime) {
        this.index = index;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public int getIndex() {
        return index;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public static int fromTime(String time) {
        // "HH:mm" 형식일 경우 초 부분을 "00"으로 추가합니다.
        if (time.length() == 5) {
            time = time + ":00";
        }
        
        for (TimeIndex timeIndex : values()) {
            System.out.println(timeIndex.getStartTime());
            if (time.compareTo(timeIndex.getStartTime()) >= 0 && time.compareTo(timeIndex.getEndTime()) <= 0) {
                return timeIndex.index;
            }
        }
        throw new IllegalArgumentException("Invalid time: " + time);
    }
}
