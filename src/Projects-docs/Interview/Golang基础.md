# Golang基础

## 类型

### 复合数据类型

#### 值类型&引用类型

##### 1、理解值类型&引用类型的区别、特点

值类型也就是基本数据类型 基本数据类型常被称为四类八种，分别为

- 整型（4种）：byte(1 byte)、short(2 byte)、int(4 byte)、long(8 byte)

- 浮点型（2种）：float(4 byte)、double(8 byte)
- 字符型（1种）：char(2 byte)
- 逻辑型（1种）：boolean

除了八种基本数据类型外，其他所有的类型都称为引用类型（数组、类、接口、字符串等）

**区别：**

值类型表示复制一个当前变量传给方法，当你在这个方法中改变这个变量的值时，最初的变量的值**不会变**；引用类型表示你操作的数据是同一个，当你在这个方法中改变这个变量的值时，最初的变量的值**会变**。

|          |                            值类型                            |                引用类型                |
| :------: | :----------------------------------------------------------: | :------------------------------------: |
| 存储方式 |                       直接存储数据本身                       |              存储数据引用              |
| 内存分配 |                          分配在栈中                          |               分配在堆中               |
|   效率   |                    效率高，不需要地址转换                    |          效率低，需要地址转换          |
| 内存回收 |                       使用完后立即收回                       | 使用完后不立即收回，而是交给GC处理回收 |
| 赋值操作 |                        创建一个新对象                        |              创建一个引用              |
| 类型拓展 |   不易拓展，所有值类型都是密封的，所以无法派生出新的值类型   |         具有多态的特性方便拓展         |
| 实例分配 | 通常是在线程栈上分配的（静态分配），但是某些情况下可以存储在堆中 |     总是在进程堆中分配（动态分配）     |

##### 2、引用类型的并发安全

在 Go 语言中，引用类型（如切片、映射、通道等）本身并不是并发安全的。这意味着在没有适当的同步机制的情况下，从多个协程（goroutine）同时访问这些类型的实例可能会导致竞态条件（race conditions）和不可预测的行为。

为了在并发环境中安全地使用这些类型，你需要采用一些同步技术，如：

1. **互斥锁（Mutex）**：通过使用标准库中的 sync.Mutex 或 sync.RWMutex，可以保证同一时间只有一个协程能访问共享资源。
2. **原子操作**：sync/atomic 包提供了一些用于执行原子操作的函数，这对于简单的状态更新非常有用。
3. **通道（Channel）**：Go 的通道本身是并发安全的。你可以使用通道来在协程之间安全地传递数据。
4. **协程间的同步**：sync.WaitGroup 或 sync.Cond 可用于协程间的同步。
5. **不共享数据**：通过避免在协程间共享数据，可以完全规避竞态条件的风险。这可以通过传递数据的副本或使用局部变量来实现。
6. **只读共享**：如果数据只被共享为只读，那么并发访问通常是安全的。

##### 3、引用类型的空指针、野指针问题

在 Go 语言中，引用类型如切片（slices）、映射（maps）、通道（channels）、接口（interfaces）、函数以及指针本身，都可以有空值（即 nil），但与 C 或 C++ 中的空指针或野指针的概念有所不同。

1. **空指针（nil）**：

   在 Go 中，当你声明一个引用类型的变量而没有给它赋值时，它的默认值是 nil。

   对 nil 值的引用类型变量进行操作通常会导致运行时错误（panic）。例如，向一个 nil 的切片添加元素会正常工作，因为切片是动态增长的，但尝试引用或修改 nil 映射中的元素会导致运行时错误。

   Go 的 nil 指针更安全，因为它不指向任何内存位置。这与 C 或 C++ 中的空指针不同，那里的空指针可能会指向一个不确定的内存地址。

2. **野指针（Dangling Pointers）**：

   野指针是指向已释放或不合法内存的指针。在 Go 中，由于垃圾回收机制的存在，野指针的问题比在 C 或 C++ 中要少得多。

   在 Go 中，当没有任何引用指向一个对象时，垃圾回收器会自动释放该对象占用的内存。因此，不太可能遇到指向已释放内存的指针。

   但是，如果你使用了 unsafe 包来进行一些非类型安全的指针操作，那么理论上还是有可能创建出野指针。

##### 问：

1、关于空指针野指针问题，go目前给出的垃圾回收机制貌似做的很不错，好像并不需要过多关注？

空指针进行错误处理时的nil检查很重要，没有nil检查，直接解引用该指针，程序将引发运行时错误

#### 数组&切片

##### 1、理解数组&切片的区别&关系

|    特性    |                     数组                     |                          切片                          |
| :--------: | :------------------------------------------: | :----------------------------------------------------: |
|    类型    |                    值类型                    |                        引用类型                        |
|    大小    |             固定大小，定义时确定             |                  动态大小，运行时可变                  |
|  内存分配  |        栈上分配（如果申明为局部变量）        |                        堆上分配                        |
|   初始化   |          默认初始化为元素类型的零值          |                  未初始化的切片为nil                   |
|  访问方式  |              直接访问，通过索引              |                 间接访问，通过底层数组                 |
| 长度和容量 |          长度固定，等于声明时的数量          | 长度和容量可变，长度是元素的数量，容量是底层数组的大小 |
|    语法    |             [n]Type，例如 [5]int             |                   []type，例如 []int                   |
|  复制行为  |           复制数组时会复制所有元素           |    复制切片时只复制切片的引用，不复制底层数组的元素    |
|    性能    | 访问速度快，但复制代价高（因为复制整个数组） |      访问速度略慢，但复制代价低（因为只复制引用）      |
|  适用场景  |           当需要固定大小集合时使用           |         更通用，特别是当需要动态大小或子切片时         |

**关系**

- 切片是建立在数组之上的抽象。当你创建一个切片时，它实际上是在操作一个底层的数组。
- 由于切片是对数组的引用，因此它们非常轻量级，并且不论它们的大小如何，传递切片的代价都是一样的。

**总结**

- **数组**是一种基本的数据结构，用于表示固定长度的同类型元素的序列。
- **切片**是 Go 语言中的一个关键特性，提供了一种灵活、强大的方式来处理数据序列，是在数组上的一层抽象，允许你高效地处理和传递数据集合的子序列。

##### 2、copy/cut /delete/extend/insert /push/pop的实现

在 Go 语言中，这些操作主要应用于切片（slice），因为数组（array）的大小是固定的。

**copy（复制）**

```go
// 假设有两个切片 src 和 dst
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src) // 将 src 的内容复制到 dst
```

**cut（剪切）**

在 Go 中没有直接的剪切操作，但你可以通过组合其他操作实现类似的功能。

```go
// 假设你想从切片中剪切出一部分
s := []int{1, 2, 3, 4, 5}
cutStart, cutEnd := 1, 3 // 要剪切的元素范围 [cutStart:cutEnd]

// 创建一个新切片，不包含被剪切的部分
newSlice := append(s[:cutStart], s[cutEnd:]...)
```

**delete（删除）**

删除切片中的元素也需要使用到 append 函数。删除某个位置的元素。

```go
// 删除索引为 i 的元素
s := []int{1, 2, 3, 4, 5}
i := 2 // 要删除的元素索引
s = append(s[:i], s[i+1:]...)
```

**extend（拓展）**

尾部插入

```go
s := []int{1, 2, 3}
s = append(s, 4, 5) // 添加元素 4 和 5
```

**insert（插入）**

```go
s := []int{1, 2, 4, 5}
i, val := 2, 3 // 在索引 i 的位置插入 val
s = append(s[:i], append([]int{val}, s[i:]...)...)
```

**push（压入）**

```go
s := []int{1, 2, 3}
s = append(s, 4) // 在末尾添加元素 4
```

**pop（弹出）**

```go
s := []int{1, 2, 3}
lastElement := s[len(s)-1] // 获取最后一个元素
s = s[:len(s)-1]           // 移除最后一个元素
```

#### 3、掌握数组&切片中"..."的用法

在 Go 语言中，“...”（省略号）在处理数组和切片时有两个主要用途：

a.数组字面量中的 ...

当声明一个数组时，你可以使用 ... 来让编译器计算数组的长度。这在你已经提供了初始化元素时非常有用，因为它避免了需要手动计数元素的数量。

例如：

```go
a := [...]int{1, 2, 3} // 编译器将计算数组的长度
```

这里，a 是一个数组，其长度为 3，类型为 [3]int。这是数组的声明和初始化的快捷方式。

b. 函数参数中的 ...

... 也用于函数参数，特别是在变参函数中。它允许你传递一个切片，而不是一个接一个地传递参数。

例如，如果你有一个接受可变数量整型参数的函数：

```go
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}
```

你可以以如下方式调用这个函数：

```go
result := sum(1, 2, 3) // 直接传递值
```

或者，如果你已经有一个切片，你可以这样调用：

```go
s := []int{1, 2, 3}
result := sum(s...) // 使用 ... 展开切片
```

在这个例子中，... 允许 sum 函数接受一个切片作为参数，而不是需要将切片的每个元素单独作为参数传递。

**总结**

- 在数组字面量中，... 用于自动计算数组的长度。
- 在函数参数中，... 用于表示函数可以接受任意数量的参数，或者将一个切片的元素作为多个参数传递给函数。

4、理解切片长度、容量以及扩容原理

**切片的长度（Length）**

- **长度**表示切片中当前存储的元素数量。
- 切片的长度可以通过内置的 len() 函数获得。
- 你可以随时修改切片的长度，只要它不超过切片的容量。

**切片的容量（Capacity）**

- **容量**是指切片底层数组可容纳的元素总数。
- 切片的容量可以通过内置的 cap() 函数获得。
- 容量决定了切片可以增长到多大，而不需要重新分配底层数组。

**扩容原理**

当添加元素到切片中，如果新的元素总数超过了切片的容量时，切片会自动进行扩容。扩容的过程大致如下：

a.**分配新数组**：Go 会创建一个新的底层数组。这个数组的容量通常是原来容量的两倍（这个倍数因具体实现和切片大小而异）。

b.**复制元素**：将原来数组中的元素复制到新数组中。

c.**返回新切片**：返回的新切片会指向这个新的底层数组，并且其容量是新数组的容量。

- 切片的自动扩容机制可能会导致频繁的内存分配和复制，特别是在大量添加元素时。为了提高效率，如果你预先知道需要存储的元素数量，最好预先指定切片的容量。
- 扩容操作可能会改变切片的底层数组引用。如果你有其他切片也指向这个底层数组，这些切片不会被更新以反映新的容量。这可能会导致意外的行为，因此在处理切片时需要格外小心。

#### map（映射）

##### 1、理解申明&初始化的区别

**声明（Declaration）**

声明一个映射意味着你创建了一个映射变量。在这个阶段，映射本身还没有分配内存空间，它的值是 nil。一个声明了但未初始化的映射不能直接使用，因为它尚未指向一个有效的内存地址。

声明映射的语法如下：

```go
var myMap map[keyType]valueType
```

例如：

```go
var myMap map[string]int
```

在这个例子中，myMap 是一个键类型为 string，值类型为 int 的映射，但它还没有被初始化，所以它的值是 nil。如果你试图向这个映射添加键值对，程序将引发运行时错误（panic）。

**初始化（Initialization）**

初始化映射意味着为映射分配内存空间，使其成为一个非 nil 的映射，从而可以存储键值对。初始化可以通过使用内置的 make 函数来完成。

初始化映射的语法如下：

```go
myMap = make(map[keyType]valueType)
```

或者在声明的同时初始化：

```go
myMap := make(map[string]int)
```

现在，myMap 是一个已初始化的映射，可以存储和检索键值对。

**声明与初始化的结合**

你也可以在一行中声明并初始化映射：

```go
myMap := map[string]int{"key1": 1, "key2": 2}
```

这里，myMap 被声明为一个 string 到 int 的映射，并立即用两个键值对初始化。

**总结**

- **声明**一个映射仅仅创建了一个映射类型的变量，但它没有指向任何实际的数据结构，其值为 nil。
- **初始化**映射将其与实际的数据结构关联，这使得映射能够被用来存储和检索键值对。
- 在映射被初始化之前，任何试图向其添加或检索键值对的尝试都将引发运行时错误。

##### 2、理解哈希冲突的解决原理

**哈希冲突（Hash Collision）**

哈希冲突发生在不同的键（key）经过哈希函数处理后，得到了相同的哈希值。由于哈希表的大小是有限的，而可能的键的数量是无限的，因此哈希冲突是不可避免的。

**哈希冲突解决**

**链地址法（Separate Chaining）**：

- 这是处理哈希冲突的常用方法之一。在这种方法中，哈希表的每个“桶”（bucket）不仅仅存储单个元素，而是存储了一个元素的链表。
- 当发生哈希冲突时，新元素会被加到这个桶对应的链表上。
- 当查找一个键时，哈希表会定位到对应的桶，然后遍历链表来找到正确的键值对。

**动态扩容**：

- 当映射的元素过多，导致哈希冲突频繁发生时，性能会下降。为了解决这个问题，Go 会根据映射的大小动态地调整哈希表的容量。
- 当映射增长到一定程度时（填充因子达到阈值），会进行扩容操作，即创建一个更大的哈希表，并将旧表中的元素重新哈希到新表中。
- 这个过程可以减少哈希冲突的发生，提高查找效率。

**高质量的哈希函数**：

- Go 语言为不同类型的键提供了高质量的哈希函数，以确保哈希值分布均匀，减少冲突的概率。

##### 问：

1、为什么var a int就可以直使用，相比于map来讲？

因为这个a是值类型了，所以不需要显式初始化，是因为 Go 在声明时自动对基础数据类型进行了零值初始化，而映射作为一种引用类型，则需要显式初始化以分配和设置其底层的数据结构。

#### 结构体

##### 1、结构体字段可以是任意类型

- **基础数据类型**：如 int、string、float64、bool 等。
- **数组和切片**：可以是任何类型的数组或切片。
- **映射（Map）**：可以包含映射类型的字段。
- **通道（Channel）**：字段可以是通道类型，用于在协程之间通信。

```go
type Worker struct {
    Jobs chan Job
}
```

- **结构体本身**：字段可以是相同的结构体类型，但必须是通过**指针引用**，以避免无限大小的结构体。

```go
type TreeNode struct {
    Left  *TreeNode
    Right *TreeNode
    Value int
}
```

- **其他自定义类型**：包括其他结构体、接口、函数类型等。

```go
//自定义函数类型的声明
type CustomFunc func(int) bool 

type Task struct {
    Execute CustomFunc
    ID      int
}
```

- **接口类型**：字段可以是接口，允许动态类型的值。

```go
type Logger struct {
    Writer io.Writer
}
```

##### 2、结构体之间的比较

**可比较的结构体**

结构体是可比较的，如果其所有字段都是可比较的。可比较的类型包括：

- 所有的基础数据类型，如 int、float64、bool、string 等。
- 指针类型。
- 数组类型，但其元素类型必须是可比较的。
- 结构体类型，但其所有字段必须是可比较的。

如果结构体的所有字段都是可比较的，那么你可以使用 == 和 != 运算符来比较两个结构体变量是否相等。

**不可比较的结构体**

如果结构体中包含以下类型的字段，则该结构体不可比较：

- 切片（slice）类型，即使其元素是可比较的。
- 映射（map）类型。
- 函数类型。
- 包含上述类型的任何复合类型。

##### 3、结构体嵌套和匿名字段

在 Go 语言中，结构体嵌套和匿名字段是一种强大的特性，它们允许你构建复杂的数据结构并提供一种类似继承的方式。这些特性提高了代码的可读性和重用性。

**结构体嵌套（Nested Structs）**

结构体嵌套是指一个结构体作为另一个结构体的字段。这允许你创建层次化的数据结构。

```go
Address struct {
    City, State string
}

type Person struct {
    Name    string
    Address Address // 嵌套结构体
}
```

在这个例子中，Address 结构体被嵌套在 Person 结构体中。你可以这样使用它：

```go
p := Person{
    Name: "John Doe",
    Address: Address{
        City:  "New York",
        State: "NY",
    },
}

fmt.Println(p.Address.City) // 访问嵌套结构体的字段
```

**匿名字段（Anonymous Fields）**

匿名字段（也称为嵌入字段）是没有显式名称的结构体字段。这通常用于模拟面向对象语言中的继承。

```go
goCopy codetype Address struct {
    City, State string
}

type Person struct {
    Name string
    Address      // 匿名字段
}
```

在这个例子中，Person 结构体有一个匿名的 Address 字段。这意味着 Person 结构体自动继承了 Address 的所有字段。

```go
p := Person{
    Name: "Jane Doe",
    Address: Address{
        City:  "Los Angeles",
        State: "CA",
    },
}

fmt.Println(p.City) // 直接访问 Address 的字段
```

使用匿名字段时，Person 实例可以直接访问 Address 的字段，好像这些字段就是在 Person 中声明的一样。

**注意事项**

- **匿名字段的类型**：匿名字段不仅限于结构体，它可以是任何类型，包括基本类型、切片、映射等。
- **字段名冲突**：如果两个或以上的匿名字段有相同的字段，就会出现名字冲突。在这种情况下，你必须显式地指定匿名字段的类型名称来访问这些字段。

```go
type Address struct {
    City string
}

type Office struct {
    City string
}

type Employee struct {
    Name    string
    Address // 匿名字段
    Office  // 匿名字段
}

func main() {
    e := Employee{}
    e.City = "New York" // 编译错误：歧义，不清楚是 Address.City 还是 Office.City
    e.Address.City = "New York" // 正确的访问方式
    e.Office.City = "Los Angeles" // 正确的访问方式
}
```

- **提升字段（Promoted Fields）**：匿名字段的字段被称为提升字段，因为它们被提升到了包含它们的结构体的层级。

##### 4、掌握结构体指针操作

结构体指针是处理结构体时常用的一种方式，它允许你直接操作结构体的内存地址，而不是其副本。

**声明和初始化结构体指针**

使用 new 关键字或 & 操作符可以创建指向结构体的指针。

```go
type Person struct {
    Name string
    Age  int
}

// 使用 new 关键字
p1 := new(Person)

// 使用 & 操作符
p2 := &Person{Name: "Alice", Age: 30}
```

**访问结构体指针的字段**

在 Go 中，即使你有一个指向结构体的指针，也可以直接使用点（.）操作符来访问其字段。这是因为 Go 会自动解引用指针。

```go
p1.Name = "Bob"
p1.Age = 25

fmt.Println(p2.Name) // 输出 "Alice"
```

**通过结构体指针修改结构体**

当你通过结构体指针修改结构体时，改动会影响到指针指向的原始结构体，因为你直接操作的是内存地址。

```go
func updateAge(p *Person, newAge int) {
    p.Age = newAge
}

updateAge(p1, 28)
fmt.Println(p1.Age) // 输出 28
```

**结构体指针和方法**

在定义结构体的方法时，你可以选择接收者是结构体类型还是结构体指针类型。使用指针类型作为接收者可以在方法内部修改结构体的内容。

```go
func (p *Person) SetName(name string) {
    p.Name = name
}

p1.SetName("Charlie")
fmt.Println(p1.Name) // 输出 "Charlie"
```

**注意事项**

- 当你想在函数或方法内部修改结构体的内容时，应该使用结构体指针。
- 使用结构体指针还可以提高性能，尤其是在处理大型结构体时，因为它避免了复制整个结构体。
- 但是，使用指针也需要小心，因为不恰当的使用可能会导致空指针异常或其他问题。

##### 5、结构体标签：omitempty、json:"name"、gorm:"column:name"、yaml:"name"

结构体标签（struct tags）提供了一种给结构体字段附加元数据的方式。这些标签不会直接影响程序的行为，但可以被库和框架用来实现序列化、反序列化、数据库映射等功能。

结构体标签是静态的，它们在编译时被确定，并且不能在运行时修改。

**omitempty**

用在 JSON 和其他格式的序列化中。当一个字段的值为空（零值）时，omitempty 会使得这个字段在序列化时被忽略。

```go
type Person struct {
    Name string `json:"name,omitempty"`
    Age  int    `json:"age,omitempty"`
}
```

在这个例子中，如果 Person 的 Name 或 Age 字段为其类型的零值（空字符串和0），在 JSON 序列化时，这些字段将被省略。

**json:"name"**

用于指定字段在 JSON 序列化和反序列化时使用的名字。

```go
type Person struct {
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
}
```

这里，JSON 序列化后的字段名将是 first_name 和 last_name 而不是 FirstName 和 LastName。

**gorm:"column:name"**

常用于 GORM 库，一个流行的 Go ORM（对象关系映射）库。它指定了结构体字段对应的数据库列名。

```go
type User struct {
    ID   uint   `gorm:"column:user_id"`
    Name string `gorm:"column:username"`
}
```

**yaml:"name**

用于 YAML 序列化和反序列化时，指定字段对应的 YAML 属性名。

```go
type Config struct {
    Host string `yaml:"host"`
    Port int    `yaml:"port"`
}
```

##### 问：

1、json和yaml的区别

YAML 更适合需要人类阅读和编写的场景，如配置文件。它的灵活语法和可读性使得编辑这些文件更为方便。而 JSON 的严格语法和紧凑格式使其成为编程和网络通信中的首选，特别是在 Web 开发中。

### 函数

#### 多返回值

##### 1、掌握返回值中的"_"的用法

下划线（_）被用作一个特殊的标识符，称为“空白标识符”。主要用途是在变量声明和赋值中表示忽略值。

**使用场景**

- **忽略多返回值中的某些值**

在 Go 中，许多标准库函数和用户定义的函数返回两个或多个值，通常是一个结果和一个错误值。如果你对某个返回值不感兴趣，可以使用空白标识符来忽略它。

```go
value, _ := strconv.Atoi("123") // 忽略错误返回值
```

在这个例子中，strconv.Atoi 返回两个值：转换后的数字和可能的错误。如果你确定转换不会出错，可以使用 _ 忽略错误值。

- **在循环中忽略索引或值**

当使用范围（range）循环遍历数组、切片、映射或通道时，你可能只对键（索引）或值感兴趣。

```go
for _, v := range slice {
    fmt.Println(v) // 只需要值，忽略索引
}
```

- **导入包而不使用**

在 Go 中，导入的包必须使用，否则会编译错误。如果你只需要导入包，以便它的初始化函数被调用，而不需要直接使用包中的任何函数或类型，你可以使用空白标识符作为包的别名。

```go
import _ "net/http/pprof"
```

这导入了 net/http/pprof 包，但不直接使用它的任何功能。

##### 2、掌握error返回值的处理方式

错误处理是通过 error 类型来进行的。error 类型是一个接口类型，定义了一个返回错误信息的 Error() 方法。

**基本错误处理**

当一个函数返回错误时，通常是作为最后一个返回值。你应该总是检查这个错误值。

```go
value, err := strconv.Atoi("123")
if err != nil {
    // 错误处理
    fmt.Println("An error occurred:", err)
    return // 或者根据错误类型采取其他措施
}
// 正常情况下的逻辑
fmt.Println("Converted number:", value)
```

**自定义错误**

你可以使用 errors.New  创建基本的错误消息，或者通过实现 error 接口来创建更复杂的错误类型。

```go
import (
    "fmt"
    "errors"
)

// 自定义错误类型
type MyError struct {
    Msg string
    Code int
}

// 实现 error 接口
func (e *MyError) Error() string {
    return fmt.Sprintf("%d - %s", e.Code, e.Msg)
}

// 一个可能返回自定义错误的函数
func doSomething(bad bool) error {
    if bad {
        // 创建并返回自定义错误
        return &MyError{"Something happened", 400}
    }
    return nil // 没有错误
}

func main() {
    // 基本错误
    err := errors.New("something went wrong")
    fmt.Println(err)

    // 检查 doSomething 函数的返回值
    err = doSomething(true)
    if err != nil {
        fmt.Println("Error:", err)
    }
}
```

**错误处理策略**

- **直接处理错误**：如上面的示例所示，直接检查和处理错误。

- **传递错误**：在某些情况下，你可能希望将错误返回给调用者，让它决定如何处理。

- **记录错误**：记录错误信息，然后可能继续执行或返回错误。

- **使用 panic 和 recover**：这不是常见的错误处理策略，但对于严重的错误（如程序无法继续运行的错误）可以使用。panic 可以在发生严重错误时中断常规的流程，recover 可以捕获到 panic 的错误，用于错误恢复。

```go
defer func() {
    if r := recover(); r != nil {
        fmt.Println("Recovered from error:", r)
    }
}()
panic("something bad happened")
```

panic 函数会立即停止当前函数的执行，开始执行该函数的任何延迟函数（deferred functions）。然后，它会终止当前协程（goroutine），并沿调用栈向上传播，继续中断每一层的函数调用，直到达到当前协程的顶层。如果 panic 达到协程的顶层而没有被恢复（recover），程序将会异常退出。

使用 panic 的情况包括：

- 程序遇到了一个无法恢复的错误，无法继续执行。
- 发生了某些不应该发生的错误，如数组越界访问、空指针引用等。

recover 函数用于重新获得协程的控制权，阻止 panic 的继续传播。它只在延迟函数（deferred functions）内部有效。当你在延迟函数中调用 recover 时，它会返回引起 panic 的值，并且停止 panic 的传播过程，程序控制权回到 panic 之后的第一条语句。

#### 匿名函数的定义和用法

##### 1、赋值、调用、传递、作为返回值

匿名函数是没有名字的函数。它们可以在需要函数类型的地方定义和使用，使代码更加灵活和动态。

**赋值给变量**

你可以将匿名函数赋值给一个变量，然后像普通函数一样调用这个变量。

```go
add := func(a, b int) int {
    return a + b
}

result := add(3, 4) // 调用匿名函数
fmt.Println(result)  // 输出：7
```

**直接调用**

匿名函数可以在定义后立即执行，这通常称为自执行函数。

```go
goCopy codefunc(a, b int) {
    fmt.Println("Sum:", a+b)
}(3, 4) // 自执行，输出：Sum: 7
```

**作为参数传递**

匿名函数可以作为参数传递给其他函数，这在定义回调函数或者实现高阶函数时非常有用。

```go
func applyFunc(a, b int, f func(int, int) int) int {
    return f(a, b)
}

result := applyFunc(3, 4, func(a, b int) int {
    return a * b
})
fmt.Println(result) // 输出：12
```

**作为返回值**

匿名函数可以作为其他函数的返回值。这在构建工厂函数或实现闭包时特别有用。

```go
func createMultiplier(factor int) func(int) int {
    return func(x int) int {
        return x * factor
    }
}

double := createMultiplier(2)
fmt.Println(double(5)) // 输出：10
```

#### 闭包

##### 1、定义和用法

**定义：**

闭包是一个函数，它可以作为一个变量被传递或返回。在定义时，会捕获周围的环境中的一个或多个变量。这些被捕获的变量会和闭包一起存在，即使在它的外部作用域已经结束。

**用法：**

- **作为函数返回值**

闭包常见的用法是作为另一个函数的返回值。在这种情况下，闭包可以保留并操作其外部函数的局部变量。

```go
func counter(start int) func() int {
    count := start
    return func() int {
        count++
        return count
    }
}

func main() {
    c := counter(10)
    fmt.Println(c()) // 输出：11
    fmt.Println(c()) // 输出：12
}
```

- **作为参数传递**

```go
func operate(a int, b int, f func(int, int) int) int {
    return f(a, b)
}

func main() {
    sum := func(a, b int) int {
        return a + b
    }

    result := operate(5, 3, sum)
    fmt.Println(result) // 输出：8
}
```

**捕获循环变量**

在循环中使用闭包时，要特别小心变量捕获的方式。

```go
func main() {
    var funcs []func() int
    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() int {
            return i
        })
    }

    for _, f := range funcs {
        fmt.Println(f()) // 可能都输出：3
    }
}
```

在这个例子中，所有闭包都捕获了相同的变量 i。由于循环结束时 i 的值是 3，因此所有闭包调用可能都返回 3。

每个闭包都捕获了循环变量 i 的引用，而不是在闭包创建时 i 的值。由于闭包共享同一个 i 变量，当你最后调用这些闭包时，它们返回的是 i 的当前值，而不是它们被创建时的值。

```go
var funcs []func() int
for i := 0; i < 3; i++ {
    loopVar := i // 创建 i 的副本
    funcs = append(funcs, func() int {
        return loopVar
    })
}

for _, f := range funcs {
    fmt.Println(f()) // 现在输出 0, 1, 2
}
```

loopVar 在每次迭代中都是一个新变量（因为它的声明在循环内部），所以每个闭包都捕获了不同的 loopVar 实例。

##### 2、理解闭包引用变量的释放时机

闭包会捕获并持有对其外部变量的引用，直到闭包本身不再被使用为止。这意味着只要闭包还可能被调用，闭包内部引用的变量就不会被垃圾回收器（GC）回收。

**释放时机**

- **闭包生命周期结束**：当闭包不再被引用，或者它所在的作用域结束时，闭包和它引用的变量都将变为垃圾回收的候选对象。

- **外部变量不再被其他地方引用**：如果闭包是对外部变量的唯一引用，当闭包被释放时，这些外部变量也会被释放。

**问：**

1、闭包和匿名函数什么关系？

- 每一个闭包都是匿名函数，但并非所有的匿名函数都是闭包。
- 当匿名函数捕获了它的外部作用域中的变量时，它就变成了一个闭包。
- 匿名函数提供了定义简洁函数的方式，而闭包则允许函数访问并操作非局部变量。

#### 可变参数

##### 1、掌握函数中的"..."的用法

函数可以定义可变参数来接受数量不定的参数。这是通过在参数类型前加上省略号 ... 来实现的。使用可变参数的函数可以接受任意数量的该类型参数。

```go
//定义可变参数函数
func myFunction(a int, b ...int) {
    // 函数内部处理可变参数
    fmt.Println(a) // 单个参数
    for _, v := range b {
        fmt.Println(v) // 可变参数
    }
    
    //传递可变参数给其他函数
    anotherFunction(b ...int)
}

func anotherFunction(a ...int) {
    // ...
}

//调用可变参数函数
myFunction(1)
myFunction(1, 2)
myFunction(1, 2, 3, 4)
```

#### defer

##### 1、原理、使用以及限制

**原理：**

当你在函数中使用 defer 关键字时，随后的函数调用不会立即执行，而是被推迟到当前函数执行结束时执行。无论函数是通过正常返回还是由于 panic 异常结束，都会执行 defer。

**使用：**

- **资源清理**：确保资源（如文件或网络连接）在不再需要时被正确关闭。

```go
f, err := os.Open(filename)
//conn, err := net.Dial("tcp", "localhost:8080") 关闭连接
if err != nil {
    // 错误处理
}
defer f.Close() // 确保文件最终被关闭
```

- **互斥锁**：确保在操作共享资源前后正确地锁定和解锁。

```go
mu.Lock()
defer mu.Unlock()
// 对共享资源的操作
```

- **错误处理，捕获异常**：在处理错误时，可以用来做一些清理工作或者记录。

```go
defer func() {
    if r := recover(); r != nil {
        fmt.Println("Recovered in f", r)
    }
}()
panic("panic example")
```

**限制：**

- **性能开销**：每个 defer 语句在运行时都需要添加到堆栈中，这可能会引入小的性能开销。在性能敏感的代码中，过度使用 defer 可能需要注意。

- **变量评估时机**：defer 语句中的函数参数会在 defer 语句声明时立即求值，而不是在函数实际执行时。

```go
a := 1
defer fmt.Println(a) // 输出 1，而不是 2
a = 2
```

- **错误忽略**：如果 defer 后的函数返回错误，通常这个错误会被忽略。需要显式地检查这些错误，如果它们对程序逻辑很重要的话。

```go
defer func() {
    if err := f.Close(); err != nil {
        // 处理错误
    }
}()
```

- **资源释放延迟**：由于 defer 语句直到函数退出前不执行，因此资源释放可能会被延迟。在处理大量资源或需要及时释放资源的场景下，需要谨慎使用 defer。

##### 2、执行顺序：先进后出

最后一个被 defer 的函数调用会首先执行，而第一个 defer 的函数调用会最后执行。

```go
func main() {
    defer fmt.Println("First defer")
    defer fmt.Println("Second defer")
    defer fmt.Println("Third defer")
    fmt.Println("Function body")
}
```

当这个函数运行时，输出顺序将会是：

```go
Function body
Third defer
Second defer
First defer
```

这种逆序执行的特性使得 defer 非常适合用于处理成对的操作，如打开/关闭、加锁/解锁、分配/释放等，确保即使在发生错误或异常情况下，资源也能被适当地清理。

##### 3、应用场景：释放资源、关闭连接、捕获异常

#### panic异常

##### 1、了解常见panic场景——空指针、越界、断言、map相关panic

- **空指针解引用**

当你试图通过一个 nil 指针访问其指向的对象时，Go 会产生 panic。

```go
var p *MyStruct
fmt.Println(p.Field) // panic: p 是 nil，不能解引用
```

- **数组/切片的索引越界**

访问数组或切片时，如果索引超出了它们的长度范围，会产生 panic。

- **类型断言失败**

当对接口类型的变量进行类型断言时，如果断言的目标类型与变量的实际类型不匹配，会产生 `panic`。

```go
var i interface{} = "hello"
f := i.(float64) // panic: 接口 i 不包含类型为 float64 的值
```

类型断言是 Go 中的一个功能，它用于提取接口变量中的底层具体值。

- **Map 相关的 Panic**

  - 向 nil Map 中写入数据：

    如果你尝试向一个 nil 的映射（map）写入数据，会产生 panic。

    ```go
    var m map[string]int
    m["one"] = 1 // panic: m 是 nil
    ```

  - 重复关闭chan：

    重复关闭一个通道（channel）也会导致 panic。

    ```go
    c := make(chan int)
    close(c)
    close(c) // panic: 重复关闭通道
    ```

##### 2、掌握recover捕获异常

panic 是一种用于处理不可恢复的错误的机制，而 recover 是用来捕获这种错误的内置函数。当 panic 被触发时，它会立即停止当前函数的执行，并逐层向上返回，直到遇到了可以处理这个 panic 的 recover。使用 recover 可以从 panic 引起的异常状态中恢复，防止程序崩溃。

为了捕获 panic，recover 需要在 defer 语句中调用。defer 语句可以保证即使发生了 panic，defer 中的代码仍然会被执行。

**注意事项**

- **recover 只有在与 panic 同一协程（goroutine）中调用时才有效**。如果 panic 发生在一个协程中，而 recover 在另一个协程中，则无法捕获到该 panic。
- **recover 最好用在延迟函数中**。这是因为延迟函数能保证在 panic 后执行。
- **recover 可以获取 panic 的值**。在上面的例子中，recover() 返回了被传递给 panic 的参数。
- **避免滥用 panic 和 recover**。在 Go 中，它们通常只用于处理真正的程序错误（如索引越界、不可恢复的环境问题等），而业务逻辑相关的错误应该使用显式的错误返回值来处理。

### 方法

#### 函数和方法的区别

**函数（Function）**

函数是一段独立的代码块，它可以接受输入参数，执行一系列操作，然后可能返回一个或多个结果。函数不属于任何对象或类型。

```go
func Add(a int, b int) int {
    return a + b
}
```

**方法（Method）**

方法是附加到特定类型的函数。它有一个接收者（receiver），接收者是定义该方法的类型的一个实例。

```go
type Circle struct {
    Radius float64
}

// Area 方法计算圆的面积
func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func main() {
    circle := Circle{Radius: 5}

    // 调用 Area 方法
    area := circle.Area()

    // 输出结果
    fmt.Printf("Area of the circle: %f\n", area)
}
```

在这个例子中，Distance 是 Point 类型的一个方法，它有一个 Point 类型的接收者 p。

##### 1、声明方法的区别

##### 2、作用域的区别

##### 3、调用方式的区别

|     区别     |                   函数                   |                        方法                        |
| :----------: | :--------------------------------------: | :------------------------------------------------: |
|   **声明**   |               独立类型声明               |                     绑定到类型                     |
|  **作用域**  | 依赖于函数被声明的位置，可以是全局或局部 | 限于定义该方法的类型。方法可以访问其类型的所有字段 |
| **调用方式** |       直接通过函数名调用，传入参数       |                 通过类型的实例调用                 |
|    接收者    |                    无                    |                         有                         |
| 访问类型成员 |   函数本身不能访问任何类型的字段或方法   |      方法可以访问其接收者类型的字段和其他方法      |
|     多态     |               不能实现多态               |                可以通过接口实现多态                |

#### 掌握继承、多态的模拟实现

Go 语言没有提供传统的面向对象编程中的类继承和多态机制。不过，通过组合（而非继承）和接口，Go 提供了这些概念的强大替代方案。

**组合实现“继承”**

在 Go 中，可以通过嵌入一个类型到另一个类型来实现类似继承的行为。这种方式通常被称为组合。

```go
type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return "My name is " + a.Name
}

type Dog struct {
    Animal // 嵌入 Animal，Dog "继承" 了 Animal 的方法
}

func main() {
    d := Dog{Animal{"Max"}}
    fmt.Println(d.Speak()) // 输出：My name is Max
}
```

在这个例子中，Dog 类型嵌入了 Animal 类型，因此 Dog “继承” 了 Animal 的所有方法。

**接口实现多态**

多态在 Go 语言中是通过接口实现的。接口提供了一种方式，允许不同的类型以相同的方式被处理，只要它们实现了相同的接口。

```go
type Speaker interface {
    Speak() string
}

func PerformSpeak(s Speaker) {
    fmt.Println(s.Speak())
}

type Animal struct {
    Name string
}

type Cat struct {
    Animal
}

type Dog struct {
    Animal
}

// Cat 实现了 Speaker 接口
func (c Cat) Speak() string {
    return "Meow! My name is " + c.Name
}

func (c Dog) Speak() string {
    return "Meow! My name is " + c.Name
}

func main() {
    dog := Dog{Animal{"Max"}}
    cat := Cat{Animal{"Whiskers"}}

    PerformSpeak(dog) // 输出：My name is Max
    PerformSpeak(cat) // 输出：Meow! My name is Whiskers
}
```

#### 方法的Receiver

##### 1、值类型&指针类型

##### 2、值传递&指针传递

**值类型的接收者**

当方法的接收者是值类型时，调用该方法时使用的是接收者的副本。这意味着方法内部对接收者的任何修改都不会影响原始实例。

```go
type MyStruct struct {
    field int
}

func (s MyStruct) SetValue(val int) {
    s.field = val // 只会修改副本
}

func main() {
    s := MyStruct{field: 1}
    s.SetValue(2)
    fmt.Println(s.field) // 输出 1，原始实例未被修改
}
```

**指针类型的接收者**

当方法的接收者是指针类型时，调用该方法时使用的是指向接收者实例的指针。这意味着方法内部对接收者的任何修改都会影响到原始实例。

```go
func (s *MyStruct) SetValue(val int) {
    s.field = val // 会修改原始实例
}

func main() {
    s := MyStruct{field: 1}
    s.SetValue(2)
    fmt.Println(s.field) // 输出 2，原始实例被修改
}
```

### 接口

#### 空接口

空接口（empty interface）是一个特殊的接口类型，它没有定义任何方法。由于 Go 中的接口是隐式实现的，任何类型都至少实现了零个方法，因此任何类型都实现了空接口。这使得空接口可以被用来接受或存储任意类型的值。

**空接口的定义**

```go
interface{}
```

这个定义没有指定任何方法，因此所有类型都满足这个接口。

##### 1、接受、存储任意类型

**接受任意类型**

由于空接口没有定义任何方法，所以可以接受任意类型的值。这在处理不确定类型的数据时非常有用，例如在需要从函数返回不同类型的值，或者在处理像 JSON 解析这样的泛型数据结构时。

```go
func PrintValue(v interface{}) {
    fmt.Println(v)
}

func main() {
    PrintValue("Hello")
    PrintValue(123)
    PrintValue(4.56)
}
```

**存储任意类型**

空接口同样可以被用来存储不确定类型的值。例如，你可以创建一个包含空接口类型的切片来存储不同类型的值。

```go
func main() {
    var values []interface{}
    values = append(values, "Hello", 42, 3.14, true)

    for _, value := range values {
        fmt.Println(value)
    }
}
```

##### 2、配合类型断言

**类型断言的基本用法**

类型断言的语法是 x.(T)，其中 x 是接口类型的变量，T 是你希望断言的目标类型。类型断言返回两个值：其底层值以及一个布尔值，表示断言是否成功。

```go
var i interface{} = "hello"

s, ok := i.(string)
if ok {
    fmt.Println(s) // 如果断言成功，s 是字符串类型
} else {
    fmt.Println("Value is not a string")
}
```

如果断言成功，ok 为 true，s 将是字符串类型。如果断言失败，ok 为 false，s 将是类型 T 的零值，在这个例子中是空字符串。

**仅返回值的断言**

你也可以只获取断言的结果值，而不检查它是否成功。但是，如果断言失败，程序将触发 panic。

```go
var i interface{} = "hello"
s := i.(string) // 这里没有检查断言是否成功
fmt.Println(s)
```

这种用法在你确定接口值的类型时很有用，但如果你对类型不确定，最好使用两值形式的断言，以避免程序 panic。

**类型断言用于类型切换**

类型断言也可以用在类型切换（type switch）中，这在你需要根据不同类型执行不同操作时非常有用。

```go
var i interface{} = // ...

switch v := i.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Int:", v)
default:
    fmt.Println("Unknown type")
}
```

在这个类型切换中，i 的真实类型将决定哪个 case 语句被执行。v 将是对应类型的值。

#### 接口类型

##### 1、面向接口设计范式，高内聚低耦合

**面向接口设计范式**

- 高内聚（High Cohesion）

高内聚是指模块（如函数、类型等）应该关注单一的任务或功能。这意味着每个模块都非常专注于它所做的事情，而不是试图做太多不相关的事情。在 Go 中，这通常通过定义小而专一的接口来实现。

```go
//好的接口定义：小而专一
type Logger interface {
    Log(message string)
}
```

这个 Logger 接口非常专一，只关注日志记录功能。

- 低耦合（Low Coupling）

低耦合是指模块之间的依赖应该最小化。在 Go 中，这是通过使用接口来实现的，而不是直接依赖具体的实现。这样，不同的模块就可以通过接口相互作用，而不需要知道对方的具体实现。

```go
// 使用接口而不是具体类型
func ProcessData(logger Logger) {
    // ...
    logger.Log("Processing data")
}
```

这个 ProcessData 函数依赖于 Logger 接口，而不是具体的日志记录器实现。这允许在不改变 ProcessData 函数的情况下，传入不同的日志记录器实现。

#### 类型断言

##### 1、variable.(TypeName)

#### 嵌套和组合

**嵌套（Nesting）**

嵌套是指将一个类型定义为另一个类型的一部分。在 Go 中，这通常是通过在一个结构体中定义另一个结构体的字段来实现的。

```go
type Address struct {
    City, State, Country string
}

type Person struct {
    Name    string
    Address Address
}
```

在这个例子中，Person 结构体嵌套了 Address 结构体。你可以像这样访问嵌套的字段：

```go
p := Person{
    Name: "Alice",
    Address: Address{
        City: "Springfield",
        State: "MA",
        Country: "USA",
    },
}
fmt.Println(p.Address.City)
```

**组合（Composition）**

组合是一种更强大的方式，它通过嵌入一个类型的匿名字段来实现。在 Go 中，这被广泛用作继承的一种替代方式。

```go
type Address struct {
    City, State, Country string
}

type Person struct {
    Name    string
    Address // 匿名嵌入 Address
}
```

在这个例子中，Person 结构体通过匿名嵌入 Address 类型，从而**继承**了 Address 的所有字段和方法。这允许你直接通过 Person 类型的实例访问 Address 的字段：

```go
p := Person{
    Name: "Bob",
    Address: Address{
        City: "Springfield",
        State: "MA",
        Country: "USA",
    },
}
fmt.Println(p.City) // 直接访问 City 字段
```

## 并发编程

### goroutine

#### 理解进程、线程、goroutine的区别

|   特性/概念    |                             进程                             |                       线程                       |                          goroutine                           |
| :------------: | :----------------------------------------------------------: | :----------------------------------------------: | :----------------------------------------------------------: |
|      定义      | 操作系统分配资源和掉地的基本单位。每个进程有自己的内存空间和资源 |    进程内的执行单元。线程共享其所属进程的资源    |       Go语言的轻量级线程，由Go运行时管理，而非操作系统       |
|    资源消耗    |              相对较高。每个进程有独立的内存空间              |           较进程少。线程共享内存和资源           |    非常低。goroutine在共享内存空间中运行，占用的内存极小     |
|    通信方式    |         进程间通信（IPC）如管道、信号量、共享内存等          | 线程间可以直接读写进程数据段（如全局变量）来通信 |             通过channel进行通信，也可以共享内存              |
| 上下文切换开销 |              较高。涉及完整的进程地址空间的切换              |           较低。同一进程内切换共享内存           |            非常低。Go运行时优化了调度和上下文切换            |
|    并发支持    |                 通常每个CPU核心运行一个进程                  |      一个进程可以运行多个线程，实现多核并行      | 大量gorountine可以在一个或多个线程上轻松运行，支持大规模并发 |
|    适用场景    |          需要完全独立的执行环境，或资源隔离较重要时          |        需要共享内存，执行轻量级任务并发时        |             大规模并发处理，如网络服务、并行计算             |

#### 了解golang runtime GMP 调度机制

Go 语言的运行时（runtime）调度器是一个复杂且高效的系统，它使用了一个称为 GMP 的模型来调度 Goroutines。在这个模型中，"G" 代表 Goroutine，"M" 代表机器（Machine，实际上是操作系统线程），而 "P" 代表处理器（Processor，一个逻辑概念，代表 Goroutine 执行所需的资源）。

**GMP 模型的组件**

- **G（Goroutine）**：

  - 轻量级的线程，由 Go 运行时管理，而不是操作系统。

  - 每个 Goroutine 都有自己的栈，非常小，且可以动态增长和缩小。

  - Goroutines 在 M 中得到执行。

- **M（Machine）**：

  - 代表操作系统的线程。

  - 用于执行 Goroutines，由 Go 运行时和操作系统共同管理。

  - M 必须持有一个 P 才能执行 Goroutines。

- **P（Processor）**：

  - 代表 Goroutine 执行所需的资源，如栈空间。

  - P 的数量在程序启动时设置，通常等于机器的 CPU 核心数。

  - P 维护一个本地 Goroutine 队列，用于调度 Goroutine 到 M 上执行。

**GMP 调度机制**

- 当一个 Goroutine 需要执行时，它会被放入一个 P 的本地队列中。如果这个 P 没有绑定任何 M，它会尝试获取一个空闲的 M 来执行 Goroutines。
- 如果所有的 M 都在忙，且有 Goroutines 等待运行，运行时可能会创建更多的 M（限制在一定数量）。
- 当一个 M 阻塞在系统调用上时，P 会被解绑，并绑定到另一个空闲的 M 上，以保持其他 Goroutines 的执行。
- 为了防止某些长时间运行的 Goroutine 占据 M，Go 运行时会进行抢占式调度（它允许操作系统或运行时系统中断当前正在运行的任务（如线程或 Goroutine），以便运行其他任务。这是为了确保所有任务都能获得合理的处理器时间，特别是在一个任务运行时间过长时，避免其他任务饿死（即长时间得不到执行））。
- P 也会周期性地从全局队列或其他 P 的本地队列中偷取 Goroutine 来保证负载均衡，也叫”工作窃取“（其中空闲的 P（处理器）会尝试从其他忙碌的 P 或全局队列中窃取 Goroutines 来执行。通常，窃取的策略是从其他 P 的队列尾部取出 Goroutines，这是为了减少与正常工作中的 P 争夺队列头部 Goroutine 的竞争）。

#### 掌握goroutine之间的同步、通信方式

为了进行同步和通信，Go 提供了几种机制，主要包括通道（Channels）和同步原语，如 WaitGroup、Mutex 等。

- **通道（Channels）**

通道是 Go 语言中用于在 Goroutines 之间传递数据的主要方式。它们提供了一种安全的机制来同时读写共享数据。

```go
ch := make(chan int)

// 发送数据到通道
go func() {
    ch <- 1
}()

// 从通道接收数据
data := <-ch
fmt.Println(data)
```

通道可以是有缓冲的或无缓冲的，它们在同步和通信方面有不同的行为和性能特点。

- **WaitGroup**

sync.WaitGroup 用于等待一组 Goroutines 完成。它的主要方法有 Add(delta int)、Done() 和 Wait()。

```go
var wg sync.WaitGroup

for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(i int) {
        defer wg.Done()
        fmt.Println(i)
    }(i)
}

wg.Wait() // 等待所有 Goroutine 完成
```

**Add **方法用于设置 WaitGroup 需要等待的 Goroutines 数量，通常在启动 Goroutine 之前调用 Add 方法来设置计数

**Done** 方法用于通知 WaitGroup 一个 Goroutine 已经完成，它是 Add(-1) 的简便方式。通常在 Goroutine 的工作结束时调用 Done 方法。

**Wait** 方法将阻塞，直到所有的 Goroutines 调用 Done 方法，即 WaitGroup 的计数器回到零。通常在所有 Goroutine 启动后调用 Wait 方法。

- **Mutex（互斥锁）**

sync.Mutex 和 sync.RWMutex 提供了一种保护共享资源的方式，防止多个 Goroutines 同时访问相同的数据。

```go
var mu sync.Mutex
var count int

// 在 Goroutine 中使用互斥锁保护共享资源
go func() {
    mu.Lock()
    count++
    mu.Unlock()
}()
```

- **Cond（条件变量）**

sync.Cond 可以在某个条件发生变化时通知等待的 Goroutines。它常用于协调需要等待特定条件的 Goroutines。

```go
var mu sync.Mutex
var ready bool
cond := sync.NewCond(&mu)  //创建了一个条件变量 cond，与互斥锁 mu 相关联

// 等待条件
go func() {
    mu.Lock()
    for !ready {  //会持续进行
        cond.Wait()  //Wait 首先释放与 cond 相关联的互斥锁，允许其他 Goroutine 修改 ready 变量或执行其他需要该锁的操作,然后，当前 Goroutine 阻塞，等待条件变量 cond 的通知。
    }
    mu.Unlock()
}()

// 改变条件并通知
mu.Lock()
ready = true 
cond.Broadcast()  //因 cond.Wait() 阻塞的 Goroutines 被唤醒,Goroutines 会从 Wait 方法调用点继续执行，这意味着它们会重新开始运行等待条件中的代码
mu.Unlock()
```

**NewCond **创建一个新的 Cond 实例。它需要一个 Locker（通常是 *sync.Mutex 或 *sync.RWMutex）。

**Wait **方法会阻塞调用它的 Goroutine，直到被 Signal 或 Broadcast 唤醒。

**Signal **唤醒等待此条件的一个 Goroutine（如果存在）。

**Broadcast **唤醒等待此条件的所有 Goroutines。

- **Channel 选择器（Select）**

select 语句允许同时等待多个通道操作，对 Goroutines 之间的复杂通信进行调度。

```go
select {
case msg1 := <-ch1:
    fmt.Println("Received", msg1)
case msg2 := <-ch2:
    fmt.Println("Received", msg2)
default:
    fmt.Println("No message received")
}
```

select 语句同时等待两个通道 ch1 和 ch2。当 ch1 或 ch2 中有数据可接收时，对应的 case 会执行。

如果 ch1 和 ch2 都没有数据，select 会一直等待，除非有 default case。

### channel

#### 有缓冲&无缓冲channel

**无缓冲通道（Unbuffered Channel）**

无缓冲通道是同步的，这意味着发送和接收操作是同时进行的。当一个数据被发送到无缓冲通道时，发送操作会阻塞，直到另一个 Goroutine 从通道接收数据。同样，如果没有数据可以接收，接收操作也会阻塞。

```go
ch := make(chan int) // 创建无缓冲通道

go func() {
    ch <- 42 // 发送操作将等待直到数据被接收
}()

data := <-ch // 接收数据
fmt.Println(data) // 输出: 42
```

在这个示例中，发送操作 ch <- 42 会等待，直到另一个 Goroutine 执行 <-ch 来接收数据。

**有缓冲通道（Buffered Channel）**

有缓冲通道具有一个固定大小的缓冲区。发送操作只有在缓冲区满时才会阻塞，接收操作只有在缓冲区空时才会阻塞。这允许 Goroutines 在没有直接接收者时，仍然能够继续发送数据到通道中（直到缓冲区被填满）。

```go
ch := make(chan int, 2) // 创建有缓冲通道，缓冲区大小为 2

ch <- 42  // 不会阻塞，因为缓冲区未满
ch <- 27  // 不会阻塞，因为缓冲区未满

fmt.Println(<-ch) // 输出: 42
fmt.Println(<-ch) // 输出: 27
```

在这个示例中，两次发送操作都不会阻塞，因为缓冲区有足够的空间。接收操作将从缓冲区中取出数据。

##### 1、理解同步&异步机制

- **无缓冲通道**：提供了一种**同步**的通信方式。每个发送操作都直接与一个接收操作匹配，这有助于理解和控制程序的并发行为。
- **有缓冲通道**：提供了一种**异步**的通信方式。发送操作可以在没有立即接收者的情况下完成，这可以减少等待和阻塞，但同时也使程序的并发行为更难以预测。

##### 2、带缓冲channel避免Gorountine泄露

Goroutine 泄露指的是那些被阻塞无法正常退出的 Goroutines，它们可能会占用不必要的资源，甚至导致内存泄露。

**为什么带缓冲通道有助于避免 Goroutine 泄露**

- **非阻塞发送操作**：当通道有足够的缓冲空间时，向通道发送数据不会阻塞。这意味着即使没有 Goroutine 立即接收数据，发送操作也可以完成，从而允许发送数据的 Goroutine 正常退出。

- **控制并发和工作负载**：带缓冲的通道可以作为一个控制并发任务数量的工具。你可以根据缓冲区大小来调节并发的任务数量，防止过多的 Goroutine 同时运行。

#### 单项channel

##### 1、理解只读&只写机制

单向通道（single-directional channels）是一种特定类型的通道，它限制了通道的使用方式，使得通道要么仅用于发送数据（只写），要么仅用于接收数据（只读）。

**只写通道（Send-Only Channel）**

只写通道的类型表示为 **chan<- Type**。

```go
func sendOnly(ch chan<- int) {
    ch <- 42 // 可以发送数据
    // <-ch // 错误：不能从只写通道中接收数据
}
```

**只读通道（Receive-Only Channel）**

只读通道的类型表示为 **<-chan Type**。

```go
func receiveOnly(ch <-chan int) {
    data := <-ch // 可以接收数据
    // ch <- 23 // 错误：不能向只读通道发送数据
}
```

**注意事项**

- 单向通道主要用在函数或方法的参数中。在函数或方法的内部，通常使用常规的双向通道。
- 你不能将一个单向通道转换为另一个方向的单向通道，但可以将一个双向通道转换为任意一种单向通道。
- 单向通道是类型级别的限制，它们本质上仍然是普通的通道，具有相同的底层数据结构。

#### channel结合select使用

##### 1、使用场景

- **同时处理多个通道**

```go
select {
case msg1 := <-ch1:
    // 处理 ch1 上的数据
case msg2 := <-ch2:
    // 处理 ch2 上的数据
}
```

适用于通道数量已知且固定的情况。

- **超时和取消**

```go
select {
case res := <-requestChan:
    // 处理请求结果
case <-time.After(time.Second * 5):
    // 处理超时情况
}
```

time.After 是一个 Go 标准库函数，返回一个类型为 <-chan Time 的通道。time.After 会在指定的时间间隔（这里是 5 秒）后向返回的通道发送当前时间。在 select 语句中使用 time.After 可以实现在等待一定时间后执行一些操作的效果，常用于超时处理。

- **非阻塞通道操作**

```go
select {
case msg := <-ch:
    // 接收消息
default:
    // 如果 ch 阻塞，则执行此处的代码
}
```

- **动态通道监听**

```go
select {
case <-ch1:
    // 处理 ch1
case <-ch2:
    // 处理 ch2
// 可能还有其他情况
}
```

适用于需要根据运行时的情况来动态改变监听的通道集合的场景。

- **并发控制**

可以控制并发执行的任务，例如限制同时运行的 Goroutines 数量。

```go
select {
case sem <- struct{}{}:
    // 获取信号量并执行任务
    go func() {
        defer func() { <-sem }()
        // 执行任务
    }()
default:
    // 如果信号量已满，可以直接返回或等待
}
```

struct{}常用于表示信号而非数据，因为它仅表示类型而没有实际的数据载荷。

struct{}{} 是创建一个 struct{} 类型的实例，即一个空结构体实例。它通常用于通道操作，特别是在通道用作信号传递而非数据传递时。

#### 优雅关闭channel

##### 1、不要试图从接收方关闭channel，如果通道有多个并发发送者，则不要关闭

通常情况下，接收方应该避免关闭通道，因为它可能无法知道是否还有其他的发送操作未完成。尝试从接收方关闭通道可能会引发竞争条件，特别是当通道有多个并发的发送者时。

##### 2、仅应该在发送方goroutine是该channel的唯一发送者时，在该goroutine中关闭

通道应该只在确保没有其他发送操作时关闭，最安全的做法是在创建该通道的同一个 Goroutine 中进行关闭。如果你的通道有多个发送者，考虑使用一个计数器或其他同步机制来确定所有发送操作何时完成，然后在安全的时刻关闭通道

##### 3、避免重复关闭channel导致panic

#### 理解channel阻塞机制、死锁问题

**通道的阻塞机制**

- **无缓冲通道（Unbuffered Channel）**：在无缓冲通道上的发送、接收操作会阻塞，直到另一个 Goroutine 在该通道上执行接收操作。
- **有缓冲通道（Buffered Channel）**：发送、接收操作仅当通道的缓冲区已满时阻塞。

**死锁问题**

- **单个 Goroutine 的死锁**

如果一个 Goroutine 在等待一个永远不会发生的通道操作（如只进行发送操作而没有接收方），那么它会永远阻塞，导致死锁。

```go
ch := make(chan int)
ch <- 42 // 死锁：没有 Goroutine 来接收数据
```

- **多个 Goroutine 的循环等待**

如果两个或多个 Goroutines 彼此等待对方通过通道发送或接收数据，它们可能会陷入永久的等待状态。

```go
ch1 := make(chan int)
ch2 := make(chan int)

go func() {
    <-ch1
    ch2 <- 1
}()

go func() {
    <-ch2
    ch1 <- 1
}()

// 死锁：两个 Goroutine 都在等待对方先行动
```

**避免死锁的策略**

- **确保通道的发送和接收平衡**：发送和接收操作应该匹配并平衡，避免只有发送没有接收，或者只有接收没有发送的情况。
- **使用 select 语句和 default 分支**：可以通过 select 语句的 default 分支来避免阻塞，特别是在可能出现死锁的场景。
- **合理设计并发结构**：确保 Goroutines 之间的依赖关系不会导致循环等待。

### context

#### 掌握context的创建、传递、获取

context 包提供了一种控制 Goroutines 的生命周期的方式。它用于传递取消信号、超时、截止日期和其他请求范围的值。

- **context 的创建**

  - **Background **和 **TODO**

    - **Background**：通常用于主函数、初始化以及测试时的顶层 context。它没有任何取消信号、截止时间，也不携带任何值。

      ```go
      ctx := context.Background()
      ```

    - **TODO**：当不清楚应该使用哪个 context 或者还没有可用的 context 时使用。主要用于占位符。

      ```go
      ctx := context.TODO()
      ```

  - **WithCancel**

    - **WithCancel**：创建一个新的 context，该 context 会在调用返回的 cancel 函数时取消。适用于需要手动停止 Goroutine 的场景。

      ```go
      ctx, cancel := context.WithCancel(context.Background())
      defer cancel() // 确保所有路径上都调用了 cancel
      ```

  - **WithDeadline **和 **WithTimeout（超时控制）**

    - **WithDeadline**：创建一个新的 context，该 context 会在指定的时间点自动取消。

      ```go
      d := time.Now().Add(50 * time.Millisecond)
      ctx, cancel := context.WithDeadline(context.Background(), d)
      defer cancel()
      ```

    - **WithTimeout**：WithDeadline 的便捷替代方法，会在指定的时间段后自动取消。

      ```go
      ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
      defer cancel()
      ```

- **context 的传递**

context 被设计为跨 API 和进程边界传递。它应该作为函数的第一个参数传递，并沿着调用栈向下传递到每一个需要它的 Goroutine 或者函数。

```go
func doWork(ctx context.Context) {
    // 使用 context，比如检查取消信号
    select {
    case <-ctx.Done():
        // 处理取消情况
        return
    default:
        // 正常业务逻辑
    }
}
```

ctx.Done() 是 context.Context 接口中的一个方法，它返回一个通道（chan struct{}）。这个通道在关联的 context 被取消时关闭，无论是因为超时、截止时间到达还是显式调用了取消函数。ctx.Done() 用于监听 context 的取消事件，从而可以响应 context 的取消，如中断阻塞操作或清理资源。

- **context 的获取和使用**

在函数内部，你可以通过 context 获取取消信号、截止时间或者传递的值。最常见的用途是检查 context 是否已被取消，这对于停止长时间运行的操作特别有用。

```go
select {
case <-ctx.Done():
    // 如果 context 被取消，处理相应的逻辑
    return ctx.Err()
default:
    // 正常的业务逻辑
}
```

##### 1、超时控制、超时传递、跨进程超时传递

- **超时控制（Timeout Control）**

​	**WithTimeout**

- **超时传递（Timeout Propagation）**

​	超时 context 可以传递给多个 Goroutines，确保它们都遵循同一超时规则。

- **跨进程超时传递（Cross-process Timeout Propagation）**

  跨进程的超时传递更复杂，因为需要在进程间通信。一种方法是将超时时间作为参数传递给新进程，然后在新进程中基于该时间创建一个本地 context。

#### 超时控制

##### 1、当一个context 被取消时，从它派生的所有context 也将被取消

派生的 context 会继承父 context 的取消信号和截止时间。

假设你创建了一个带超时的 context：

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
```

然后从这个 context 派生出新的 context：

```go
childCtx, childCancel := context.WithCancel(ctx)
defer childCancel()
```

childCtx 是从 ctx 派生出来的。如果 ctx 因超时（5秒后）或调用了 cancel() 而被取消，那么 childCtx 也会被自动取消。

WithCancel 是 Go 语言标准库 context 包中的一个函数。它用于创建一个新的 context 对象，这个新的 context 是从一个已存在的 context（通常称为“父 context”）派生出来的。

### sync包常用并发安全数据结构

#### sync.WaitGroup

##### 1、使用sync.WaitGroup来追踪每一个创建的goroutine

**如何使用 sync.WaitGroup**

**a. 初始化 sync.WaitGroup**

sync.WaitGroup 不需要显式初始化，声明后即可使用。

```go
var wg sync.WaitGroup
```

**b.在启动 Goroutine 前调用 Add**

在创建 Goroutine 之前，你需要调用 wg.Add(delta int) 来设置 WaitGroup 计数器，其中 delta 是你打算等待完成的 Goroutines 数量。

```go
wg.Add(1) // 增加一个计数
```

**c.在 Goroutine 内部调用 Done**

当 Goroutine 完成它的任务时，它应该调用 wg.Done() 来减少 WaitGroup 的计数器。wg.Done() 是 wg.Add(-1) 的快捷方式。

```go
go func() {
    defer wg.Done() // 确保在函数退出时调用 Done
    // ... 执行任务 ...
}()
```

**d.使用 Wait 阻塞，直到所有 Goroutine 完成**

主 Goroutine 会调用 wg.Wait()，这将阻塞，直到所有的 Goroutines 调用 Done，即计数器减到零。

```go
wg.Wait() // 等待所有 Goroutine 完成
```

#### sync.Mutex

##### 1、了解锁的应用场景，和上锁流程和机制

通过使用 sync.Mutex，你可以避免在并发环境下的数据竞争（race condition）和相关的问题。

**应用场景**

- **保护共享资源**：当多个 Goroutines 需要安全地访问相同的数据时（如全局变量、数据结构的字段等）。

- **确保数据一致性**：防止同时读写同一个变量导致的数据不一致问题。

- **串行化操作**：在并发环境中，对需要串行执行的代码块进行互斥访问控制。

**上锁流程和机制**

- **创建 Mutex**

可以通过直接声明 sync.Mutex 变量来创建一个互斥锁。

```go
var mu sync.Mutex
```

- **上锁（Locking）**

在访问共享资源之前，调用 mu.Lock() 上锁。这将阻止其他 Goroutine 获取同一个锁。

```go
mu.Lock()
```

- **访问共享资源**

在获取锁之后，你可以安全地读取或修改共享资源。

- **解锁（Unlocking）**

完成共享资源的访问后，调用 mu.Unlock() 释放锁，这样其他等待的 Goroutines 就可以获取锁来访问共享资源了。

```go
mu.Unlock()
```

**注意事项**

- **死锁风险**：确保在每个可能的代码路径上都正确地释放锁，避免死锁。使用 defer 释放锁是一个好习惯。
- **避免长时间持有锁**：持有锁的时间越长，等待获取锁的 Goroutines 阻塞的时间就越长。尽量减少锁持有的时间。
- **不要对未加锁或已解锁的 Mutex 执行 Unlock**：这会导致 panic。
- **避免重入**：sync.Mutex 是不可重入的，同一个 Goroutine 在未释放锁之前再次尝试获取锁会导致死锁。

#### sync.Pool

##### 1、保存和复用临时对象，以减少内存分配，降低gc压力

**如何工作**

sync.Pool 维护了一个对象池，池中的对象可以被重复利用。当你需要一个新对象时，可以从 Pool 获取；当对象不再需要时，可以将其放回 Pool。如果 Pool 为空，就会创建一个新对象。

**主要方法**

- **Get**：从 Pool 中获取一个对象。如果 Pool 为空，会调用 New 函数来创建一个新对象（如果 New 已经被设置）。
- **Put**：将一个不再使用的对象放回 Pool 中，供后续重用。

```go
var pool = sync.Pool{
    New: func() interface{} {  //返回的类型是 interface{}
        return new(MyObject) // 创建一个新的 MyObject 对象
    },
}

// 从 Pool 获取一个对象
obj := pool.Get().(*MyObject)

// 使用 obj 进行操作...

// 使用完后，将对象放回 Pool
pool.Put(obj)
```

**使用场景**

- **管理临时对象**：对于频繁创建和销毁的小对象，使用 sync.Pool 可以减少内存分配。

- **降低GC压力**：减少内存分配频率可以减轻垃圾回收器的负担，提高程序性能。

- **并发场景**：sync.Pool 是并发安全的，适合在多个 Goroutines 中共享和重用对象。

**注意事项**

- Pool 中保存的对象不应该有任何状态，因为你无法预知下一次获取的是哪个对象。
- sync.Pool 中的对象可能随时被垃圾回收，所以不应该用来保存需要长期持有的对象。
- 每次从 Pool 获取对象后，应该重置对象（将对象清空，置零）的状态，以避免意外的数据共享问题。

#### sync.Atomic

##### 1、不可被打断的原子操作，保证并发安全

提供了一组用于低级并发编程的原子操作。这些操作是在多线程环境下同步访问共享资源的基本工具。原子操作可以保证在任何时刻只有一个 Goroutine 能够对变量进行操作，从而确保并发安全。

**原子操作的特点**

- **不可分割**：原子操作在执行过程中不会被其他线程（或 Goroutine）中断，要么全部执行，要么全部不执行。
- **并发安全**：在并发环境下，原子操作可以安全地读写共享变量，无需使用互斥锁（sync.Mutex）。

**使用 sync/atomic**

sync/atomic 包提供了多种原子操作，包括对整数的读写、增加和比较并交换等。以下是一些常用的原子操作示例：

- **读写操作**

```go
var counter int64

// 原子增加
atomic.AddInt64(&counter, 1)

// 原子读取
value := atomic.LoadInt64(&counter)

// 原子写入
atomic.StoreInt64(&counter, 10)
```

- **比较并交换（Compare And Swap，CAS）**

CAS 操作用于在当前值符合预期时更新变量的值，是一种常用的原子操作。

```go
var flag int32

// 如果 flag 当前是 0，则将其设置为 1
if atomic.CompareAndSwapInt32(&flag, 0, 1) {
    fmt.Println("flag is set")
}
```

**使用场景**

原子操作通常用于以下场景：

- **计数器**：在并发环境中对计数器进行安全操作，如统计在线用户数、完成任务数等。
- **状态标记**：标记程序状态，如是否已初始化、是否正在运行等。
- **高效同步**：在不需要完整互斥锁的情况下进行高效的同步操作。

**注意事项**

- 虽然原子操作性能较高，但它们不总是替代互斥锁的最佳选择。在复杂的同步场景中，使用互斥锁可能更加直观和安全。
- 原子操作无法保证复杂数据结构的完整性和一致性，这时应考虑使用互斥锁。

## 包管理

### 版本管理

#### 理解GOPATH机制&Go Moudules机制

**GOPATH 机制**

GOPATH 是 Go 语言较早的项目布局和包管理方式。在 Go 1.11 之前，它是管理 Go 代码的标准方法。

**特点**

- **工作区**：GOPATH 定义了一个工作区，其中包含三个主要目录：src（源代码）、pkg（编译后的包文件）、bin（编译后的可执行文件）。

- **包路径**：在 GOPATH/src 下的代码路径即为包的导入路径。例如，GOPATH/src/github.com/user/project 的包导入路径为 github.com/user/project。

- **依赖管理**：在 GOPATH 模式下，所有的项目和依赖都存放在同一个 GOPATH 目录下。它不支持版本控制和依赖版本管理。

**使用限制**

- 所有 Go 项目必须位于 GOPATH 目录下。
- 依赖共享同一个 GOPATH，可能导致版本冲突。
- 不支持版本化的依赖管理。

**Go Modules 机制**

Go Modules 是 Go 1.11 引入的官方依赖管理系统，标志着 Go 语言在包管理方面的一次重大改进。从 Go 1.13 开始，`Go Modules` 成为默认的依赖管理机制。

**特点**

1. **项目无关性**：不再要求项目必须在 GOPATH 下。你可以在任意位置创建和维护 Go 项目。
2. **版本控制**：Go Modules 支持依赖的版本管理。每个模块的依赖在 go.mod 文件中声明，包括依赖的具体版本。
3. **模块化**：每个项目都被视为一个模块，可以包含自己的依赖。
4. **可重现构建**：go.mod 和 go.sum 文件确保了项目构建的可重现性，不同开发者和环境能够得到相同的构建结果。

**使用流程**

- 初始化模块：在项目目录下运行 go mod init [module-name]，会创建 go.mod 文件。
- 添加依赖：在代码中导入依赖包后运行 go build 或 go test，依赖会自动添加到 go.mod 和 go.sum。
- 版本控制：可以在 go.mod 文件中指定依赖的版本。

**总结**

- **GOPATH** 是早期 Go 项目的组织方式，所有项目和依赖都位于同一个工作区内，不支持版本控制。
- **Go Modules** 是现代 Go 项目的依赖管理和项目组织方式，支持在任何地方创建项目，提供版本控制和可重现构建。

#### 掌握go get命令获取不同版本的方法

##### 1、最小版本管理（MVS）

**使用 go get 获取特定版本**

- **获取最新版本**：默认情况下，go get package-path 会下载并安装最新的稳定版本。

- **指定版本**：你可以在包的路径后加上 @version 来获取特定版本。

### 包导入、包作用域

**包导入**

当你在 Go 文件中导入包时，可以使用 import 语句：

- **标准库包**：像 fmt 和 os 这样的标准库包直接使用其名称。
- **外部包**：非标准库的包，如 github.com/user/project/pkg，使用其完整的导入路径。

**包作用域**

- **导入的包**：导入的包只在当前文件中可见。如果其他文件也需要使用相同的包，那么这些文件也需要单独导入该包。
- **公开（Exported）标识符**：在 Go 中，以大写字母开头的标识符是公开的，可以被其他包访问。例如，fmt.Println 中的 Println 是公开的。
- **非公开（Unexported）标识符**：以小写字母开头的标识符是包私有的，只能在同一个包内访问。

#### 包之间的顺序依赖限制

- **无循环依赖**：Go 不允许包之间存在循环依赖。例如，如果包 A 导入了包 B，那么包 B 就不能导入包 A。

- **初始化顺序**：如果包有多个文件，它们在同一个包中按照文件名的字典序进行初始化。跨包的初始化顺序基于依赖关系。一个包在其依赖的所有包初始化完成后才会初始化。

- **初始化函数**：init 函数在包初始化时被调用，用于设置包级别的状态。如果一个包有多个 init 函数（可能分布在多个文件中），它们的调用顺序不是由源代码的顺序决定的。

#### 包名称的唯一性

实际上，有许多包可能有相同的名称，但它们的导入路径是不同的。

### internal包

#### 限制包的可见范围

#### 导出路径包含internal关键字的包，只允许internal的父级目录及父级目录的子包导入，其他包无法导入

Go 语言的 internal 包提供了一种限制包可见性的机制。这是 Go 1.4 引入的一个特性，允许你定义一些只能被同一个父目录下的其他包所使用的代码。

**如何使用 internal 包**

- **创建 internal 目录**：你可以在你的项目中任何位置创建一个名为 interna` 的目录。在这个目录下的所有 Go 代码都被认为是内部包。

- **限制访问**：位于 internal 目录下的包只能被同一个父目录树中的 Go 代码所导入和使用。这意味着，如果其他项目尝试导入这些包，将会得到一个编译错误。

假设你有以下目录结构：

```go
myproject/
├── api/
│   └── api.go
└── internal/
    └── core/
        └── core.go
```

在这个例子中，myproject/internal/core 包只能被 myproject 目录下的其他包所导入。例如，myproject/api/api.go 可以导入 myproject/internal/core，但是位于 myproject 外部的其他项目则不能。

### go mod

#### go mod tidy

当使用 Go Modules 作为依赖管理工具时，这个命令帮助维护项目的 go.mod 和 go.sum 文件，确保它们反映了项目的实际依赖。

##### 1、引用项目需要的依赖增加到go.mod文件

##### 2、去掉go.mod文件中项目不需要的依赖

#### go mod verify

##### 1、确保构建项目时，使用相同的包版本

#### go mod vendor

##### 1、项目依赖包的复制

当运行 go mod vendor 时，Go 会查看您的项目中的 go.mod 文件，并下载所有必需的依赖项。这些依赖项被复制到项目的 vendor 目录中。这意味着您的项目中将包含一个包含所有依赖代码的目录。这对于确保项目依赖的一致性和可重现性非常有用，因为它允许您的项目直接使用这些复制的依赖，而不是依赖外部的包仓库。

##### 2、包的离线构建

由于 vendor 目录包含了所有必需的依赖项，因此即使在没有网络连接的情况下，您也可以构建您的 Go 项目。当使用 go build 或 go run 等命令时，如果存在 vendor 目录，Go 将优先使用该目录中的依赖项进行构建，而不是从网络上下载。