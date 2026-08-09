package TAWactch.example.TAWatch.dto.respone;

import java.util.List;

public class PagedResponse<T> {
    private List<T> content;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;

    public PagedResponse(List<T> content, int currentPage, int totalPages, long totalElements, int pageSize) {
        this.content = content;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
    }

    public List<T> getContent() { return content; }
    public int getCurrentPage() { return currentPage; }
    public int getTotalPages() { return totalPages; }
    public long getTotalElements() { return totalElements; }
    public int getPageSize() { return pageSize; }
}
