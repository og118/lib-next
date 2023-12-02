import logging
import sys

logger = logging.getLogger()
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "[%(asctime)s] [%(filename)s:%(lineno)d] %(levelname)s - %(message)s",
    "%d-%m %H:%M:%S",
)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
handler.setFormatter(formatter)

logger.addHandler(handler)
