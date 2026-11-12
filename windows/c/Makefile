# RUBY AI — C Native Subsystem Makefile
CC ?= gcc
CFLAGS = -Wall -Wextra -O2 -fPIC -Iinclude
TARGET_LIB = bin/ruby_ai_native.so
WIN_TARGET = bin/ruby_ai_native.dll

SRCS = audio.c processing.c native_sys.c
OBJS = $(SRCS:.c=.o)

all: directories $(TARGET_LIB)

directories:
	@mkdir -p bin

$(TARGET_LIB): $(OBJS)
	$(CC) -shared -o $@ $^ -lm

windows: directories
	x86_64-w64-mingw32-gcc -shared -o $(WIN_TARGET) $(SRCS) -Iinclude -O2 -DPSAPI_VERSION=1 -lpsapi

clean:
	rm -rf *.o bin/
