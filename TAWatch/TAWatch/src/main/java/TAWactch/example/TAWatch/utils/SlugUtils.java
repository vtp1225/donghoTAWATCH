package TAWactch.example.TAWatch.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {

    private static final Pattern NON_ASCII = Pattern.compile("[^\\p{ASCII}]");
    private static final Pattern NON_ALNUM = Pattern.compile("[^a-z0-9-]");
    private static final Pattern MULTI_DASH = Pattern.compile("-+");
    private static final Pattern EDGE_DASH = Pattern.compile("^-|-$");

    public static String toSlug(String text) {
        if (text == null || text.isBlank()) return "";
        String processed = text.toLowerCase()
                .replace("đ", "d");
        String normalized = Normalizer.normalize(processed, Normalizer.Form.NFD);
        String ascii = NON_ASCII.matcher(normalized).replaceAll("");
        String slug = NON_ALNUM.matcher(ascii).replaceAll("-");
        return EDGE_DASH.matcher(MULTI_DASH.matcher(slug).replaceAll("-")).replaceAll("");
    }
}
