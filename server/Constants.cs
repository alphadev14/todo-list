using System.ComponentModel;

namespace server
{
    public enum TodoStatus
    {
        [Description("Khởi tạo")]
        PENDING,
        [Description("Đang xử lý")]
        IN_PROGRESS,
        [Description("Hoàn thành")]
        DONE,
        [Description("Đã hủy")]
        CANCELED
    }
}
