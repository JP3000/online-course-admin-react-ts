import { Button, message } from "antd";
import { useRef } from "react";
import * as XLSX from "xlsx"; // 1. 引入xlsx库
import { stuBatch } from "../../api/user";

export default function ImportExcel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const importExcel = () => {
    const file = fileRef.current?.files?.[0]; //4. 获取input拿到的excel文件对象
    if (!file) {
      message.warning("请先选择Excel文件");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file); // 转成 二进制格式
    reader.onload = async () => {
      try {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          message.error("未读取到工作表");
          return;
        }

        const sheet = workbook.Sheets[firstSheetName];
        const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (!records.length) {
          message.warning("工作表没有可导入的数据");
          return;
        }

        await stuBatch(records as any); // api上传

        //5-2，excel数据转为html
        if (containerRef.current) {
          containerRef.current.innerHTML = XLSX.utils.sheet_to_html(sheet);
        }

        message.success(`导入成功，共 ${records.length} 条数据`);
      } catch {
        message.error("导入失败，请检查文件格式");
      } finally {
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      message.error("文件读取失败");
    };
  };
  return (
    <div>
      <Button
        onClick={() => {
          // 2. 触发input文件选择器
          fileRef.current?.click();
        }}
      >
        导入Excel数据
      </Button>
      {/* 3.  input文件的选择，触发excel文件解析函数*/}
      <input
        type="file"
        hidden
        id="fileRef"
        accept=".xlsx,.xls"
        ref={fileRef}
        onChange={importExcel}
      />
      <div id="cont" ref={containerRef}></div>
    </div>
  );
}
