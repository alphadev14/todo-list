using server.BO.User;

namespace server.BO.Todo
{
    public class TodoBO
    {
        public int TodoId { get; set; }             // Khóa chính
        public string Title { get; set; }           // Tiêu đề công việc
        public string? Description { get; set; }    // Mô tả chi tiết
        public string Status { get; set; } = "PENDING"; // Trạng thái: PENDING, DONE...
        public int Priority { get; set; } = 0;      // Độ ưu tiên
        public DateTime? DueDate { get; set; }      // Ngày hết hạn
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string CreatedUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedUser { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedUser { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
