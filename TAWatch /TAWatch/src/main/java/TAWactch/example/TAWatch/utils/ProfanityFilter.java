package TAWactch.example.TAWatch.utils;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

public class ProfanityFilter {

    private static final List<String> BANNED_WORDS = List.of(
        "dit", "dich", "lon", "cac", "buoi", "dai", "ngu", "khon", "cho", "chet",
        "du", "dm", "dcm", "dkm", "dmm", "vcl", "vkl", "clm", "cc", "cu",
        "dam", "phang", "chich", "fuck", "shit", "bitch", "asshole",
        "bastard", "cunt", "dick", "pussy", "motherfucker"
    );

    private ProfanityFilter() {}

    private static String normalize(String text) {
        if (text == null) return "";
        String lower = text.toLowerCase()
                .replace("đ", "d")
                .replace("0", "o")
                .replace("1", "i")
                .replace("3", "e")
                .replace("4", "a")
                .replace("5", "s")
                .replace("$", "s")
                .replace("@", "a");
        // Strip diacritics
        String nfd = Normalizer.normalize(lower, Normalizer.Form.NFD);
        return nfd.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                  .replaceAll("[^a-z0-9\\s]", " ")
                  .replaceAll("\\s+", " ")
                  .trim();
    }

    public static boolean contains(String text) {
        if (text == null || text.isBlank()) return false;
        String cleaned = normalize(text);
        for (String word : BANNED_WORDS) {
            String normalizedWord = normalize(word);
            if (cleaned.contains(normalizedWord)) return true;
        }
        return false;
    }
}
