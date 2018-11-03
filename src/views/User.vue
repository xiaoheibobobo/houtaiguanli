<template>
<!-- 面包屑 -->
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
        <el-col :span="24">
            <el-input placeholder="请输入内容" clearable class="searchInput" v-model="searchVal">
                <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
            </el-input>
            <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEditUser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 用户权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleSetrole">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                    <!-- //请选择 -->
                    <el-option disabled label="请选择" :value="-1">

                    </el-option>
                    <el-option v-for="(item,index) in roles" :label="item.roleName" :key="index" :value="item.id ">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleSetrole = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="40">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column label="创建日期" width="180">
            <template slot-scope="scope">
                {{scope.row.create_time | formData}}
            </template>
        </el-table-column>
        <el-table-column prop="date" label="用户状态" width="100">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="cheangeSwitchMgstate(scope.row)">
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column prop="date" label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" plain circle @click="showEditBox(scope.row.id)"></el-button>
                <el-button type="success" icon="el-icon-check" size="mini" plain circle @click="showRoleBox(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain circle @click="showDeleBox(scope.row.id)"></el-button>
            </template>
        </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            //加载动画
            loading: false,
            //分页相关
            pagenum: 1,
            pagesize: 2,
            currentPage: 1,
            total: 0,
            //搜索
            searchVal: "",
            //添加用户对话框的属性
            dialogFormVisibleAddUser: false,
            //表单数据
            formData: {
                // username: '',
                // password: '',
                // email: '',
                // mobile: ''
            },
            formLabelWidth: '100px',
            // 编辑用户对话框
            dialogFormVisibleEditUser: false,
            dialogFormVisibleSetrole: false,
            currUserName:'',
            //当前的角色名
            currRoleId:-1,
            roles:[],
            currUserId:-1,
        };
    },
    //   clearable() {
    //     this.loadTabData()
    //   },
    created() {
        this.loadTabData();
    },
    methods: {
        //分配权限发送请求
        async setRole() {
            const res = await this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId})
            const {meta:{status,msg}} = res.data
            this.$message.success(msg)
            this.dialogFormVisibleSetrole = false
        },
        //分配权限
       async showRoleBox(user) {
        //    给上边setRole拿用户id
            this.currUserId = user.id

            this.currUserName = user.username
            this.dialogFormVisibleSetrole = true
            const res = await this.$http.get(`roles`)
            this.roles = res.data.data
        },
        //信息修改
        async editUser() {
            this.dialogFormVisibleEditUser = false
            const res = await this.$http.put(`users/${this.formData.id}`, this.formData)
            this.loadTabData()
            this.$message.success(res.data.meta.msg)
        },

        //编辑对话框
        async showEditBox(userId) {
            this.dialogFormVisibleEditUser = true
            const res = await this.$http.get(`users/${userId}`)
            this.formData = res.data.data
        },
        //添加用户
        async addUser() {
            //关闭对话框
            this.dialogFormVisibleAddUser = false
            //请求
            const res = await this.$http.post('users', this.formData)
            console.log(res)
            //提示框
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            this.loadTabData()
            this.$message.success(msg)
            // this.formData = {}
            for (const key in this.formData) {
                if (this.formData.hasOwnProperty(key)) {
                    this.formData[key] = ''
                }
            }
        },
        //添加用户对话框
        showAddUserDia() {
            this.dialogFormVisibleAddUser = true
        },
        //删除用户
        showDeleBox(userId) {
            this.$confirm("are you sure?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(async () => {
                    const res = await this.$http.delete(`users/${userId}`);
                    const {
                        meta: {
                            msg,
                            status
                        }
                    } = res.data;
                    if (status === 200) {
                        this.loadTabData();
                        this.$message({
                            type: "success",
                            message: msg
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: msg
                    });
                });
        },

        //改变用户状态
        async cheangeSwitchMgstate(user) {
            const res = await this.$http.put(
                `users/${user.id}/state/${user.mg_state}`
            );
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data;
            if (status === 200) {
                this.$message.success(msg);
            }
        },
        //查需数据库
        checkUser() {
            // if (this.searchVal) {
            this.loadTabData();
            // }
        },
        //分页相关的
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadTabData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.loadTabData();
            console.log(`当前页: ${val}`);
        },
        async loadTabData() {
            this.loading = true;
            const AUTH_TOKEN = sessionStorage.getItem("token");
            this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
            const res = await this.$http.get(
                `users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
            );
            this.total = res.data.data.total;
            const {
                meta: {
                    msg,
                    status
                },
                data: {
                    users
                }
            } = res.data;
            if (status === 200) {
                this.loading = false;
                this.list = users;
                this.pagenum = 1;
                // this.pagesize=2
                this.currentPage = 1;
            }
        }
    }
};
</script>

<style>
.box-card {
    height: 100%;
}

.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}

.searchArea .searchInput {
    width: 350px;
}
</style>
