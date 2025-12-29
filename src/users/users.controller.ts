import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

//http://localhost:3000/users
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    // @Get(':isMarried')
    // getSomeUsers(
    //     @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number, 
    //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    //     @Param() param: GetUserParamDto
    // ) {
    //     return this.usersService.getAllUsers();
    // }

    // @Get()  // Route Decorators
    // getUsers(@Query() query: any) { // Query string value
    //     if(query.gender) {
    //         // return this.usersService.getAllUsers().filter(u => u.gender === query.gender);
    //     }
    //     return this.usersService.getAllUsers();
    // }    

    // @Get(':id')  // Route Parameter Value
    // getUserById(@Param('id', ParseIntPipe) id: number) {  // pipes
    //     // return this.usersService.getUserById(id);
    // }

    @Get()
    public getUsers() {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    public getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findUserById(id);
    }

    @Post()
    public createUser(@Body() user: CreateUserDto) {
        return this.usersService.createUser(user);
    }

    @Delete(':id')
    public deleteUser(@Param('id', ParseIntPipe) id: number) {
        this.usersService.deleteUser(id);
    }
}