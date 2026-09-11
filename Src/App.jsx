import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Send,
  Sparkles,
  Volume2,
  Settings,
  MessageCircle,
  Repeat,
  ChevronRight,
  ChevronLeft,
  PenLine,
  Award,
} from "lucide-react";

const DAILY_LIMIT = 3;

const ACCENTS = [
  { id: "en-US", label: "American" },
  { id: "en-GB", label: "British" },
