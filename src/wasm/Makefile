# Makefile to build WASM TarotClub library

BASE_NAME := tarotclub
TARGET_EXEC := $(BASE_NAME).js

OUTDIR := ./build
SRC_DIRS := ./ ../ ../../lib/icl/util ../../lib/icl/json ../../lib/icl/mbedtls/include/

CC = emcc
CXX = em++

TAROT_CORE_SRCS := Card.cpp Deck.cpp BasicClient.cpp Common.cpp Engine.cpp Identity.cpp Score.cpp Protocol.cpp Network.cpp Users.cpp
ICL_SRCS := Log.cpp Util.cpp JsonValue.cpp JsonReader.cpp
MBED_TLS_SRCS := aes.c gcm.c cipher.c chachapoly.c chacha20.c poly1305.c cipher_wrap.c platform_util.c ccm.c blowfish.c arc4.c camellia.c des.c

SOURCES += main.cpp
SOURCES += $(TAROT_CORE_SRCS)
SOURCES += $(ICL_SRCS) $(MBED_TLS_SRCS)

VPATH := ../ ../../lib/icl/util
VPATH += ../ ../../lib/icl/json
VPATH += ../ ../../lib/icl/mbedtls/library

OBJECTS += $(addprefix $(OUTDIR)/,$(patsubst %.c, %.o, $(filter %.c,$(SOURCES))))
OBJECTS += $(addprefix $(OUTDIR)/,$(patsubst %.cpp, %.o, $(filter %.cpp,$(SOURCES))))
OBJECTS += $(addprefix $(OUTDIR)/,$(patsubst %.S, %.o, $(filter %.S,$(SOURCES))))
OBJECTS += $(addprefix $(OUTDIR)/,$(patsubst %.s, %.o, $(filter %.s,$(SOURCES))))

DEPENDENCIES := $(patsubst %.o,%.d,$(OBJECTS))

INC_DIRS := $(shell find $(SRC_DIRS) -type d)
INC_FLAGS := $(addprefix -I,$(INC_DIRS))

# Permet d'utiliser 'import' en ES6 : -s EXPORT_ES6=1 and -s MODULARIZE=1 
# As we tried to import the module, however, we received an error from Vue.js about the var _scriptDir = import.meta.url; 
# line of code in the generated JavaScript file. To get # around this error, we included the -s USE_ES6_IMPORT_META=0 flag 
# to tell Emscripten to use the older form of the import.meta.url line of code for systems that don’t recognize that code.

CFLAGS += -DUSE_LINUX_OS -s WASM=1 -s RESERVED_FUNCTION_POINTERS=20 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s ENVIRONMENT='web','worker'
CPPFLAGS += -MMD -MP -std=c++17
LDFLAGS += -s LLD_REPORT_UNDEFINED -s RESERVED_FUNCTION_POINTERS=20 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s ENVIRONMENT='web','worker'

$(OUTDIR)/$(TARGET_EXEC): $(OBJECTS)
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)

# c source
$(addprefix $(OUTDIR)/, %.o): %.c
	$(MKDIR_P) $(dir $@)
	$(CC) $(CFLAGS) $(CFLAGS) $(INC_FLAGS) -c $< -o $@

# c++ source
$(addprefix $(OUTDIR)/, %.o): %.cpp
	$(MKDIR_P) $(dir $@)
	$(CXX) $(CPPFLAGS) $(CFLAGS) $(INC_FLAGS) -c $< -o $@

all: $(OUTDIR)/$(TARGET_EXEC)
	cp $(OUTDIR)/$(TARGET_EXEC) ../../www/client/public/
	cp $(OUTDIR)/$(BASE_NAME).wasm ../../www/client/public/

clean:
	$(RM) -rf $(OUTDIR)

-include $(DEPENDENCIES)

MKDIR_P ?= mkdir -p

# End of Makefile
